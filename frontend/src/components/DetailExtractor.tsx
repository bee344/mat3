import React, { useState } from 'react';
import { usePublicClient } from 'wagmi';
import { parseEventLogs } from 'viem';
import {
    logisticsEventsModuleLogisticsEventsAbi as abi,
    logisticsEventsModuleLogisticsEventsAddress as addresses,
} from '../generated';

type ShipmentDetailsType = {
    shipmentId: number;
    batch: bigint;
    timestamp: number;
    stage: number;
    weight?: bigint;
    price?: bigint;
    description?: string;
    originLat?: string;
    originLong?: string;
    destLat?: string;
    destLong?: string;
    previousBlockHash?: string;
    previousShipmentId?: bigint;
};

export function ShipmentDetailsViewer() {
    const publicClient = usePublicClient();
    const contractAddress = addresses[420420422];

    const [inputId, setInputId] = useState('');
    const [shipment, setShipment] = useState<ShipmentDetailsType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchShipmentDetails(id: number) {
        setLoading(true);
        setError(null);
        setShipment(null);

        try {
            const latestBlock = await publicClient.getBlockNumber();
            const fromBlock = 0n;

            const logs = await publicClient.getLogs({
                address: contractAddress,
                fromBlock,
                toBlock: latestBlock,
            });

            const parsedLogs = parseEventLogs({ abi, logs });

            const shipmentLogs = parsedLogs.filter(
                (log) => Number(log.args.shipmentId) === id
            );

            if (shipmentLogs.length === 0) {
                setError('No shipment found with that ID.');
                return;
            }

            const creationOrUpdateLog = shipmentLogs.find((log) =>
                ['ShipmentCreated', 'ShipmentUpdated'].includes(log.eventName)
            );

            if (!creationOrUpdateLog) {
                setError('Shipment creation/update event not found.');
                return;
            }

            const batch = creationOrUpdateLog.args.batch ?? 0n;
            const timestamp = Number(creationOrUpdateLog.args.timestamp ?? 0);
            const stage = creationOrUpdateLog.args.stage ?? 0;
            const previousBlockHash = creationOrUpdateLog.args.previousBlockHash ?? null;
            const previousShipmentId = creationOrUpdateLog.args.previousShipmentId ?? null;

            const detailsLog = shipmentLogs.find((log) =>
                ['ShipmentDetails', 'ShipmentUpdateDetails'].includes(log.eventName)
            );

            const weight = detailsLog?.args.weight ?? undefined;
            const price = detailsLog?.args.price ?? undefined;
            const description = detailsLog?.args.description ?? undefined;

            const locationLog = shipmentLogs.find((log) =>
                ['ShipmentLocation', 'ShipmentUpdateLocation'].includes(log.eventName)
            );

            const originLat = locationLog?.args.originLat ?? undefined;
            const originLong = locationLog?.args.originLong ?? undefined;
            const destLat = locationLog?.args.destLat ?? undefined;
            const destLong = locationLog?.args.destLong ?? undefined;

            setShipment({
                shipmentId: id,
                batch,
                timestamp,
                stage,
                previousBlockHash: previousBlockHash ? previousBlockHash.toString() : undefined,
                previousShipmentId,
                weight,
                price,
                description,
                originLat,
                originLong,
                destLat,
                destLong,
            });
        } catch (err) {
            console.error(err);
            setError('Failed to fetch shipment details.');
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const id = parseInt(inputId.trim());
        if (isNaN(id) || id < 0) {
            setError('Please enter a valid shipment ID.');
            return;
        }
        fetchShipmentDetails(id);
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-inherit text-white rounded border border-current shadow">
            <h2 className="text-2xl font-semibold mb-4">Shipment Details Viewer</h2>
            <form onSubmit={onSubmit} className="flex gap-2 mb-4">
                <input
                    type="number"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    placeholder="Enter shipment ID"
                    className="flex-grow rounded px-3 py-2 text-white"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Fetch'}
                </button>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {shipment && (
                <div className="space-y-2 text-sm">
                    <p><strong>Shipment ID:</strong> {shipment.shipmentId}</p>
                    <p><strong>Batch:</strong> {shipment.batch.toString()}</p>
                    <p><strong>Timestamp:</strong> {new Date(shipment.timestamp * 1000).toLocaleString()}</p>
                    <p><strong>Stage:</strong> {['Harvest', 'Drying', 'Grinding', 'Blending', 'Packaging', 'Retail'][shipment.stage]}</p>
                    <p><strong>Weight:</strong> {shipment.weight ? shipment.weight.toString() : 'N/A'}</p>
                    <p><strong>Price:</strong> {shipment.price ? shipment.price.toString() : 'N/A'}</p>
                    <p><strong>Description:</strong> {shipment.description ?? 'N/A'}</p>
                    <p><strong>Origin:</strong> {shipment.originLat ?? 'N/A'}, {shipment.originLong ?? 'N/A'}</p>
                    <p><strong>Destination:</strong> {shipment.destLat ?? 'N/A'}, {shipment.destLong ?? 'N/A'}</p>
                    <p>
                        <strong>Previous Block Hash:</strong>{' '}
                        <code
                            className="max-w-xs inline-block truncate align-bottom cursor-default"
                            title={shipment.previousBlockHash ?? 'N/A'}
                        >
                            {shipment.previousBlockHash ?? 'N/A'}
                        </code>
                    </p>

                    <p><strong>Previous Shipment ID:</strong> {shipment.previousShipmentId ? shipment.previousShipmentId.toString() : 'N/A'}</p>
                </div>
            )}
        </div>
    );
}
