import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { ShipmentMap } from './ShipmentMap';
import type { LatLngTuple } from 'leaflet';
import {
    logisticsEventsModuleLogisticsEventsAbi as abi,
    logisticsEventsModuleLogisticsEventsAddress as addresses,
} from '../generated';
import { parseEventLogs } from 'viem';

interface StepMeta {
    blockHash: string;
    timestamp: number;
}

export function ShipmentTracker() {
    const publicClient = usePublicClient();
    const contractAddress = addresses[420420422];

    const [inputId, setInputId] = useState('');
    const [shipmentId, setShipmentId] = useState<number | null>(null);
    const [routePoints, setRoutePoints] = useState<LatLngTuple[]>([]);
    const [stepMetadata, setStepMetadata] = useState<StepMeta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShipmentPath = async () => {
            if (shipmentId === null) return;

            setLoading(true);
            setError(null);
            setRoutePoints([]);
            setStepMetadata([]);

            try {
                const latestBlock = await publicClient.getBlockNumber();
                const blockBatchSize = 1000n;

                let currentBlock = latestBlock;
                let logs: any[] = [];

                while (currentBlock > 0n) {
                    const fromBlock = currentBlock > blockBatchSize ? currentBlock - blockBatchSize : 0n;
                    const batchLogs = await publicClient.getLogs({
                        address: contractAddress,
                        fromBlock,
                        toBlock: currentBlock,
                    });

                    logs = [...batchLogs, ...logs];

                    const parsed = parseEventLogs({ abi, logs });
                    const hasTarget = parsed.some(
                        (ev) =>
                            ['ShipmentLocation', 'ShipmentUpdateLocation', 'ShipmentUpdated'].includes(ev.eventName) &&
                            Number((ev.args as any).shipmentId) === shipmentId
                    );

                    if (hasTarget) {
                        logs = batchLogs;
                        break;
                    }

                    if (fromBlock === 0n) break;
                    currentBlock = fromBlock - 1n;
                }

                const parsedLogs = parseEventLogs({ abi, logs });

                // 🔗 Build update chain
                const updateMap = new Map<number, bigint>();
                parsedLogs.forEach((ev) => {
                    if (ev.eventName === 'ShipmentUpdated') {
                        const { shipmentId, previousShipmentId } = ev.args as {
                            shipmentId: bigint;
                            previousShipmentId: bigint;
                        };
                        updateMap.set(Number(shipmentId), previousShipmentId);
                    }
                });

                const pathShipmentIds: number[] = [];
                let currentId: number | null = shipmentId;

                while (currentId !== null) {
                    pathShipmentIds.unshift(currentId);
                    const prev = updateMap.get(currentId);
                    if (prev === undefined) break;
                    currentId = Number(prev);
                }
                const locationEvents = parsedLogs.filter(
                    (ev) =>
                        (ev.eventName === 'ShipmentLocation' || ev.eventName === 'ShipmentUpdateLocation') &&
                        pathShipmentIds.includes(Number((ev.args as any).shipmentId))
                );

                const metadata: StepMeta[] = await Promise.all(
                    locationEvents.map(async (log) => {
                        const block = await publicClient.getBlock({ blockHash: log.blockHash });
                        return {
                            blockHash: log.blockHash,
                            timestamp: Number(block.timestamp),
                        };
                    })
                );

                const points: LatLngTuple[] = [];
                for (const ev of locationEvents) {
                    const {
                        originLat,
                        originLong,
                        destLat,
                        destLong,
                    } = ev.args as {
                        originLat: string;
                        originLong: string;
                        destLat: string;
                        destLong: string;
                        shipmentId: bigint;
                    };

                    const origin: LatLngTuple = [parseFloat(originLat), parseFloat(originLong)];
                    const destination: LatLngTuple = [parseFloat(destLat), parseFloat(destLong)];

                    if (!isNaN(origin[0]) && !isNaN(origin[1])) points.push(origin);
                    if (!isNaN(destination[0]) && !isNaN(destination[1])) points.push(destination);
                }

                const uniquePoints = points.filter(
                    (point, index, self) =>
                        index === self.findIndex((p) => p[0] === point[0] && p[1] === point[1])
                );

                setStepMetadata(metadata);

                if (uniquePoints.length < 2) {
                    setError('Not enough location data to draw a route.');
                } else {
                    setRoutePoints(uniquePoints);
                }

            } catch (err) {
                console.error('Error:', err);
                setError('Failed to load shipment path.');
            } finally {
                setLoading(false);
            }
        };

        fetchShipmentPath();
    }, [shipmentId, publicClient, contractAddress]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const id = parseInt(inputId.trim());
        if (isNaN(id) || id < 0) {
            setError('Please enter a valid shipment ID.');
            return;
        }
        setShipmentId(id);
        setError(null);
    };

    return (
        <div className="p-4 border border-current max-w-2xl mx-auto bg-inherit text-white rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Track a Shipment</h3>

            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                <input
                    type="number"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    placeholder="Enter latest shipment ID"
                    className="border px-3 py-2 rounded w-full text-white"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Track
                </button>
            </form>

            {loading && <p className="text-gray-400">Loading shipment path...</p>}
            {error && <p className="text-red-400">{error}</p>}

            {!loading && routePoints.length >= 2 && (
                <>
                    <h4 className="text-lg font-medium mb-2">Shipment ID: {shipmentId}</h4>
                    <ShipmentMap
                        origin={routePoints[0]}
                        destination={routePoints[routePoints.length - 1]}
                        waypoints={routePoints.slice(1, -1)}
                    />
                    <div className="mt-6 bg-inherit p-4 rounded">
                        <h5 className="text-md font-semibold mb-2">Shipment Stage Metadata</h5>
                        <ul className="text-sm space-y-2">
                            {stepMetadata.map((meta, i) => (
                                <li key={i} className="border-b border-gray-700 pb-2">
                                    <p><span className="font-semibold">Stage {i + 1}</span></p>
                                    <p><span className="text-gray-400">Block Hash:</span> <code className="break-all">{meta.blockHash}</code></p>
                                    <p><span className="text-gray-400">Timestamp:</span> {new Date(meta.timestamp * 1000).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
