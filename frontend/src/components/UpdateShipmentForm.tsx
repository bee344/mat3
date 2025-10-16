import { useState } from "react";
import {
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { logisticsEventsModuleLogisticsEventsAbi, logisticsEventsModuleLogisticsEventsAddress } from "../generated";

const contractAddress = logisticsEventsModuleLogisticsEventsAddress[420420422];

const STAGES = ["Harvest", "Drying", "Grinding", "Blending", "Packaging", "Retail"] as const;

export function UpdateShipmentForm() {
    const [weight, setWeight] = useState<bigint>();
    const [price, setPrice] = useState<bigint>();
    const [batch, setBatch] = useState<bigint>();
    const [description, setDescription] = useState("");

    const [originLat, setOriginLat] = useState("");
    const [originLong, setOriginLong] = useState("");
    const [destLat, setDestLat] = useState("");
    const [destLong, setDestLong] = useState("");

    const [stage, setStage] = useState<number>(0);

    const [previousBlockHash, setPreviousBlockHash] = useState<`0x${string}`>("0x0000000000000000000000000000000000000000000000000000000000000000");
    const [previousShipmentId, setPreviousShipmentId] = useState<bigint>(0n);

    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

    const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
        query: {
            enabled: !!txHash,
        },
    });

    const { writeContract, isPending, error } = useWriteContract();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !weight || !price || !batch || !originLat || !originLong ||
            !destLat || !destLong || stage === undefined
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        if (previousBlockHash && !/^0x([A-Fa-f0-9]{64})$/.test(previousBlockHash)) {
            alert("Previous Block Hash must be a valid 0x-prefixed 32-byte hex string.");
            return;
        }

        try {
            writeContract(
                {
                    abi: logisticsEventsModuleLogisticsEventsAbi,
                    address: contractAddress,
                    functionName: "updateShipment",
                    args: [
                        {
                            shipment: {
                                weight,
                                price,
                                batch,
                                origin: { latitud: originLat, longitud: originLong },
                                destination: { latitud: destLat, longitud: destLong },
                                description,
                                stage,
                            },
                            previousBlockHash,
                            previousShipmentId,
                        },
                    ],
                },
                {
                    onSuccess: (data) => {
                        setTxHash(data);
                    },
                }
            );
        } catch (err) {
            console.error("Contract call failed:", err);
        }
    };

    return (
        <div className="mx-auto p-6 border border-current rounded-lg shadow-lg max-w-full sm:max-w-lg text-left text-inherit">
            <h2 className="text-2xl font-bold mb-6">Update Shipment</h2>
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
                        onChange={(e) => setDestLat(e.target.value)}
                        required
                        className="flex-1 min-w-[140px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Destination Longitude"
                        onChange={(e) => setDestLong(e.target.value)}
                        required
                        className="flex-1 min-w-[140px] border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <textarea
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-current rounded-md px-4 py-2 placeholder-current shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    onChange={(e) => setStage(Number(e.target.value))}
                    value={stage}
                    className="w-full border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {STAGES.map((label, index) => (
                        <option key={index} value={index}>
                            {label}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Previous Block Hash (0x...)"
                    onChange={(e) =>
                        setPreviousBlockHash(e.target.value.trim() as `0x${string}`)
                    }
                    className="w-full border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="number"
                    placeholder="Previous Shipment ID"
                    onChange={(e) => setPreviousShipmentId(BigInt(e.target.value || "0"))}
                    className="w-full border border-current rounded-md px-4 py-2 placeholder-current shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    {isPending
                        ? "Submitting..."
                        : isConfirming
                            ? "Confirming..."
                            : "Update Shipment"}
                </button>
            </form>

            {txHash && (
                <div className="mt-6">
                    <p className="font-medium">Transaction sent! Hash:</p>
                    <code className="text-xs break-all block mt-1">{txHash}</code>
                </div>
            )}
            {receipt && (
                <p className="text-green-600 mt-4 font-semibold">
                    ✅ Shipment updated in block #{receipt.blockNumber.toString()}!
                </p>
            )}
            {error && (
                <p className="text-red-600 mt-4 font-semibold">❌ Error: {error.message}</p>
            )}
        </div>



    );
}
