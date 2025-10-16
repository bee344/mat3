import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { logisticsEventsModuleLogisticsEventsAbi, logisticsEventsModuleLogisticsEventsAddress } from "../generated";

const contractAddress = logisticsEventsModuleLogisticsEventsAddress[420420422];

export function TransferOwnershipForm() {
  const [newOwner, setNewOwner] = useState<`0x${string}`>("0x");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const { writeContract, isPending, error } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
    query: {
      enabled: !!txHash,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^0x[a-fA-F0-9]{40}$/.test(newOwner)) {
      alert("Invalid Ethereum address");
      return;
    }

    try {
      writeContract(
        {
          abi: logisticsEventsModuleLogisticsEventsAbi,
          address: contractAddress,
          functionName: "transferOwnership",
          args: [newOwner],
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
      <h2 className="text-xl font-bold mb-4">Transfer Contract Ownership</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="New Owner Address (0x...)"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value as `0x${string}`)}
          required
          className="input"
        />

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isPending ? "Submitting..." : isConfirming ? "Confirming..." : "Transfer Ownership"}
        </button>
      </form>

      {txHash && (
        <div className="mt-4">
          <p>Transaction sent! Hash:</p>
          <code className="text-xs break-all">{txHash}</code>
        </div>
      )}

      {receipt && (
        <p className="text-green-600 mt-2">
          ✅ Ownership transferred in block #{receipt.blockNumber.toString()}!
        </p>
      )}

      {error && (
        <p className="text-red-600 mt-2">❌ Error: {error.message}</p>
      )}
    </div>
  );
}
