import { useEffect, useState } from "react";
import {
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { logisticsEventsModuleLogisticsEventsAbi, logisticsEventsModuleLogisticsEventsAddress } from "../generated";
import { decodeEventLog } from "viem";

const contractAddress = logisticsEventsModuleLogisticsEventsAddress[420420422];

export function CreateShipmentForm() {
    const [weight, setWeight] = useState<bigint>();
    const [price, setPrice] = useState<bigint>();
    const [batch, setBatch] = useState<bigint>();

    const [originLat, setOriginLat] = useState<string>("");
    const [originLong, setOriginLong] = useState<string>("");

    const [destinationLat, setDestinationLat] = useState<string>("");
    const [destinationLong, setDestinationLong] = useState<string>("");

    const [description, setDescription] = useState<string>("");
    const [stage, setStage] = useState<number>(0);

    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

    const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
        query: {
            enabled: !!txHash,
        },
    });
    const [shipmentId, setShipmentId] = useState<bigint | null>(null);

    const { writeContract, isPending, error } = useWriteContract();

    useEffect(() => {
        if (!receipt) return;

        try {
            for (const log of receipt.logs) {
                if (log.address.toLowerCase() === contractAddress.toLowerCase()) {
                    try {
                        const decoded = decodeEventLog({
                            abi: logisticsEventsModuleLogisticsEventsAbi,
                            data: log.data,
                            topics: log.topics,
                        });

                        if (decoded.eventName === "ShipmentCreated") {
                            const id = decoded.args.shipmentId as bigint;
                            setShipmentId(id);
                            break;
                        }
                    } catch (err) {
                        // Skip logs that can't be decoded
                    }
                }
            }
        } catch (err) {
            console.error("Error decoding ShipmentCreated event:", err);
        }
    }, [receipt]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !weight || !price || !batch ||
            !originLat || !originLong ||
            !destinationLat || !destinationLong
        ) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            writeContract(
                {
                    abi: logisticsEventsModuleLogisticsEventsAbi,
                    address: contractAddress,
                    functionName: "createShipment",
                    args: [
                        {
                            weight,
                            price,
                            batch,
                            origin: {
                                latitud: originLat,
                                longitud: originLong,
                            },
                            destination: {
                                latitud: destinationLat,
                                longitud: destinationLong,
                            },
                            description,
                            stage,
                        },
                    ],
                },
                {
                    onSuccess: (txHash) => {
                        setTxHash(txHash);
                    },
                }
            );
        } catch (err) {
            console.error("Contract call failed:", err);
        }
    };

    return (
        <div className="mx-auto p-6 border border-current rounded-lg shadow-lg max-w-full sm:max-w-lg text-left text-inherit bg-inherit">
            <h2 className="text-2xl font-bold mb-6">Create Shipment</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-wrap gap-4">
                    <input
                        type="number"
                        placeholder="Weight"
                        onChange={(e) => setWeight(BigInt(e.target.value))}
                        required
                        className="flex-1 min-w-[120px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        onChange={(e) => setPrice(BigInt(e.target.value))}
                        required
                        className="flex-1 min-w-[120px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Batch"
                        onChange={(e) => setBatch(BigInt(e.target.value))}
                        required
                        className="flex-1 min-w-[120px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Origin Latitude"
                        onChange={(e) => setOriginLat(e.target.value)}
                        required
                        className="flex-1 min-w-[140px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Origin Longitude"
                        onChange={(e) => setOriginLong(e.target.value)}
                        required
                        className="flex-1 min-w-[140px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Destination Latitude"
                        onChange={(e) => setDestinationLat(e.target.value)}
                        required
                        className="flex-1 min-w-[140px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Destination Longitude"
                        onChange={(e) => setDestinationLong(e.target.value)}
                        required
                        className="flex-1 min-w-[140px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <textarea
                    placeholder="Description (optional)"
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-current rounded-md px-4 py-2 placeholder-current shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    onChange={(e) => setStage(Number(e.target.value))}
                    className="w-full border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={0}
                >
                    <option value={0}>Harvest</option>
                    <option value={1}>Drying</option>
                    <option value={2}>Grinding</option>
                    <option value={3}>Blending</option>
                    <option value={4}>Packaging</option>
                    <option value={5}>Retail</option>
                </select>

                <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    {isPending
                        ? "Submitting..."
                        : isConfirming
                            ? "Confirming..."
                            : "Create Shipment"}
                </button>
            </form>

            {txHash && (
                <div className="mt-6">
                    <p className="font-medium">Transaction sent! Hash:</p>
                    <code className="text-xs break-all block mt-1 bg-gray-100 rounded px-2 py-1">
                        {txHash}
                    </code>
                </div>
            )}
            {receipt && (
                <p className="text-green-600 mt-4 font-semibold">
                    ✅ Shipment created in block #{receipt.blockNumber.toString()}!
                    {shipmentId !== null && (
                        <>
                            <br />
                            📦 Shipment ID: {shipmentId.toString()}
                        </>
                    )}
                </p>
            )}
            {error && (
                <p className="text-red-600 mt-4 font-semibold">❌ Error: {error.message}</p>
            )}
        </div>



    );
}
