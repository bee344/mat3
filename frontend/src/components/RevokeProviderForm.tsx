import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { logisticsEventsModuleLogisticsEventsAbi } from "../generated";
import { logisticsEventsModuleLogisticsEventsAddress } from "../generated";

const contractAddress = logisticsEventsModuleLogisticsEventsAddress[420420422];

export function RevokeProviderForm() {
  const [providerAddress, setProviderAddress] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");

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
        functionName: "revokeProvider",
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
      <h2 className="text-xl font-bold mb-4">Revoke Provider</h2>
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
          disabled={!isValidAddress }
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-red-700"
        >
          { "Revoke"}
        </button>
      </form>

      {txHash && (
        <div className="mt-4 break-all text-sm">
          ✅ Transaction sent:{" "}
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {txHash}
          </a>
        </div>
      )}

      {receipt && (
        <p className="text-green-600 mt-2">
          🎉 Provider revoked in block #{receipt.blockNumber.toString()}!
        </p>
      )}

      {errorMessage && <p className="text-red-600 mt-2">❌ Error: {errorMessage}</p>}
    </div>
  );
}
