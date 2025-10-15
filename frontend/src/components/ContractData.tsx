import { logisticsEventsModuleLogisticsEventsAbi } from "../generated";
import { useReadContracts } from "wagmi";

export function ContractData(params: {
  contractAddress: `0x${string}`;
  userAddresses?: readonly `0x${string}`[];
}) {
  const userAddressesSet = new Set(params.userAddresses);

  const logisticsContract = {
    address: params.contractAddress,
    abi: logisticsEventsModuleLogisticsEventsAbi,
  } as const;

  const contractData = useReadContracts({
    contracts: [
      {
        ...logisticsContract,
        functionName: "owner",
      }
    ],
  });

  let error: string | null = null;

  if (contractData.error !== null) {
    error = contractData.error.toString();
  } else {
    error = contractData.data?.find(el => el.error !== undefined)?.toString() || null;
  }

  if (error !== null) {
    return (
      <p>
        Loading contract data for <span className="font-bold">{params.contractAddress}</span> failed!
        <br />
        <code style={{ whiteSpace: "pre-wrap" }}>{error}</code>
      </p>
    );
  }

  if (contractData.isLoading || contractData?.data === undefined || contractData.data.some(el => el === undefined)) {
    return (
      <p>
        Loading contract data for <span className="font-bold">{params.contractAddress}</span>...
      </p>
    );
  }

  const owner = contractData.data[0].result as `0x${string}`;
  const isOwner = owner && userAddressesSet.has(owner);

  return (
    <>
      <p>
        Smart contract address: <span className="font-bold">{params.contractAddress}</span>
      </p>
      <p>
        Smart contract owner: <span className="font-bold">{owner}</span>
        {isOwner && <> (that's you!)</>}
      </p>

      {isOwner ? (
        <p className="text-green-600 mt-4">You have permission to create or update shipments.</p>
      ) : (
        <p className="text-gray-500 mt-4">You are not the contract owner.</p>
      )}
    </>
  );
}
