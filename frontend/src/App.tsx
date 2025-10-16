import { useAccount, useChainId } from "wagmi";
import "./App.css";
import { logisticsEventsModuleLogisticsEventsAddress } from "./generated";

import polkadotLogo from "./assets/polkadot-logo.svg";
import mateLogo from "./assets/mate-logo.svg";
import { ContractData } from "./components/ContractData";
import { Account } from './account'
import { WalletOptions } from './wallet-options'
import { CreateShipmentForm } from "./components/CreateShipmentForm";
import { UpdateShipmentForm } from "./components/UpdateShipmentForm";
import { ShipmentTracker } from "./components/ShipmentTracker";
import { ShipmentDetailsViewer } from "./components/DetailExtractor";

const contractAddress = logisticsEventsModuleLogisticsEventsAddress[420420422];

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

function App() {
  const accountData = useAccount();
  const chainId = useChainId();

  return (
    <>
      <ConnectWallet />
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Welcome to Yerba Mat3
        </h1>
        <p className="font-light mt-2 text-lg text-gray-300">
          Where tradition meets web3
        </p>
      </div>
      <div className="flex justify-center items-center gap-4 p-4">
        <img src={polkadotLogo} className="h-52 logo" alt="Polkadot logo" />
        <img src={mateLogo} className="h-52 logo" alt="Mate logo" />
      </div>
      {accountData.connector !== undefined ? (
        <div className="container mx-auto p-2 leading-6">
          <h2 className="text-2xl font-light">Success!</h2>
          <p>Metamask wallet connected!</p>
          <p>
            Connected to chain ID: <span className="font-bold">{chainId}</span>
          </p>

          <p>
            {accountData.addresses && accountData.addresses.length > 0 ? (
              <><b>{accountData.addresses.length}</b> addresses connected!</>
            ) : (
              <>No addresses connected</>
            )}
          </p>
        </div>
      ) : (
        <div className="container mx-auto p-2 leading-6">
          Metamask wallet not connected or installed. Chain interaction is disabled.
        </div>
      )}

      <ContractData contractAddress={contractAddress} userAddresses={accountData.addresses} />
      <div className="flex flex-col items-center gap-6 w-full">
        <CreateShipmentForm />
        <UpdateShipmentForm />
        <ShipmentTracker />
        <ShipmentDetailsViewer />
      </div>
    </>
  );
}

export default App;
