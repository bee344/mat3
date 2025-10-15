import { useState } from "react";
import {
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { logisticsEventsModuleLogisticsEventsAbi } from "../generated"; // ABI must be exported from codegen
import { logisticsEventsModuleLogisticsEventsAddress } from "../generated";

const contractAddress = logisticsEventsModuleLogisticsEventsAddress[420420422];

export function CreateShipmentForm() {
    const [shipmentId, setShipmentId] = useState<bigint>();
    const [weight, setWeight] = useState<bigint>();
    const [price, setPrice] = useState<bigint>();
    const [batch, setBatch] = useState<bigint>();
    const [origin, setOrigin] = useState<string>("");
    const [receiver, setReceiver] = useState<string>("");

    const receiverAddress = receiver as `0x${string}`;
    const [destination, setDestination] = useState<string>("");
    const [description, setDescription] = useState<string>("");

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

        if (!shipmentId || !weight || !price || !batch || !origin || !receiver || !destination) {
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
                            shipmentId,
                            weight,
                            price,
                            batch,
                            origin,
                            receiver: receiverAddress,
                            destination,
                            description,
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
        <div className="max-w-md mx-auto p-4 border rounded bg-white shadow">
            <h2 className="text-xl font-bold mb-4">Create Shipment</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="number" placeholder="Shipment ID" onChange={(e) => setShipmentId(BigInt(e.target.value))} required className="input" />
                <input type="number" placeholder="Weight" onChange={(e) => setWeight(BigInt(e.target.value))} required className="input" />
                <input type="number" placeholder="Price" onChange={(e) => setPrice(BigInt(e.target.value))} required className="input" />
                <input type="number" placeholder="Batch" onChange={(e) => setBatch(BigInt(e.target.value))} required className="input" />
                <input type="text" placeholder="Origin" onChange={(e) => setOrigin(e.target.value)} required className="input" />
                <input type="text" placeholder="Destination" onChange={(e) => setDestination(e.target.value)} required className="input" />
                <input type="text" placeholder="Receiver (0x...)" onChange={(e) => setReceiver(e.target.value)} required className="input" />
                <textarea placeholder="Description (optional)" onChange={(e) => setDescription(e.target.value)} className="input" />

                <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? "Submitting..." : isConfirming ? "Confirming..." : "Create Shipment"}
                </button>
            </form>

            {txHash && (
                <div className="mt-4">
                    <p>Transaction sent! Hash:</p>
                    <code className="text-xs break-all">{txHash}</code>
                </div>
            )}
            {receipt && (
                <p className="text-green-600 mt-2">✅ Shipment created successfully in block #{receipt.blockNumber.toString()}!</p>
            )}
            {error && <p className="text-red-600 mt-2">❌ Error: {error.message}</p>}
        </div>
    );
}
