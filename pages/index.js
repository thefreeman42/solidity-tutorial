import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PrimaryButton from "../components/primary-button";
import KeyboardsContractJson from "../utils/Keyboards.json";
import Keyboard from "../components/keyboard";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [keyboards, setKeyboards] = useState([]);

  const [keyboardLayout, setKeyboardLayout] = useState(0);
  const [isPBT, setIsPBT] = useState(false);
  const [filter, setFilter] = useState("");

  const [keyboardsLoading, setKeyboardsLoading] = useState(false);

  const contractAddress = "0xe2b128c7B3Ac9A30A0e610AC90Ac9458326aA97a";
  const contractAbi = KeyboardsContractJson.abi;

  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("We have an authorized account: ", account);
      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet");
    }
  };

  const connectMetaMaskAccount = async (method) => {
    const accounts = await ethereum.request({ method });
    handleAccounts(accounts);
  };

  const initMetaMask = () => {
    if (window.ethereum) setEthereum(window.ethereum);
    if (ethereum) connectMetaMaskAccount("eth_accounts");
  };
  useEffect(() => initMetaMask(), []);

  const connectAccount = () => {
    if (!ethereum) {
      alert("MetaMask is required to connect an account");
      return;
    }
    connectMetaMaskAccount("eth_requestAccounts");
  };

  const getKeyboards = async () => {
    if (!ethereum || !connectedAccount) return;

    setKeyboardsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const keyboardsContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const keyboardsOnContract = await keyboardsContract.getKeyboards();
      console.log("Retrieved keyboards...", keyboardsOnContract);
      setKeyboards(keyboardsOnContract);
    } finally {
      setKeyboardsLoading(false);
    }
  };
  useEffect(() => getKeyboards(), [connectedAccount]);

  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site</p>;
  }

  if (!connectedAccount) {
    return (
      <PrimaryButton onClick={connectAccount}>
        Connect MetaMask Wallet
      </PrimaryButton>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton type="link" href="/create">
        Create a Keyboard!
      </PrimaryButton>
      {keyboardsLoading && <p>Loading Keyboards...</p>}
      {keyboards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {keyboards.map(([layout, isPBT, filter], i) => (
            <Keyboard key={i} kind={layout} isPBT={isPBT} filter={filter} />
          ))}
        </div>
      ) : (
        <p>No keyboards yet!</p>
      )}
    </div>
  );
}
