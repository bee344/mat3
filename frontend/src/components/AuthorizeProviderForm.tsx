import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { logisticsEventsModuleLogisticsEventsAbi } from "../generated";
import { logisticsEventsModuleLogisticsEventsAddress } from "../generated";

const contractAddress = logisticsEventsModuleLogisticsEventsAddress[420420422];

export function AuthorizeProviderForm() {
  const [providerAddress, setProviderAddress] = useState<string>("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(providerAddress);

  const { writeContract, error } = useWriteContract();

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
    query: { enabled: !!txHash },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAddress) {
      alert("Please enter a valid Ethereum address");
      return;
    }

    writeContract(
      {
        abi: logisticsEventsModuleLogisticsEventsAbi,
        address: contractAddress,
        functionName: "authorizeProvider",
        args: [providerAddress as `0x${string}`],
      },
      {
        onSuccess(data) {
          setTxHash(data);
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded bg-white shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Authorize Provider</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Provider Address (0x...)"
          value={providerAddress}
          onChange={(e) => setProviderAddress(e.target.value.trim())}
          className="input w-full"
          required
        />
        <button
          type="submit"
          disabled={!isValidAddress || isConfirming}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-700"
        >
          { isConfirming ? "Confirming..." : "Authorize"}
        </button>
      </form>

      {txHash && (
        <div className="mt-4 break-all text-sm">
          ✅ Transaction sent: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">{txHash}</a>
        </div>
      )}

      {receipt && (
        <p className="text-green-600 mt-2">🎉 Provider authorized in block #{receipt.blockNumber.toString()}!</p>
      )}

      {error && (
        <p className="text-red-600 mt-2">❌ Error: {error.message}</p>
      )}
    </div>
  );
}
