import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PrimaryButton from "../components/primary-button";
import KeyboardsContractJson from "../utils/Keyboards.json";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [keyboards, setKeyboards] = useState([]);
  const [newKeyboard, setNewKeyboard] = useState("");

  const contractAddress = "0x963F2E72A0c537E6EA3F4aA619C3d947fe37c44f";
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
  };
  useEffect(() => getKeyboards(), [connectedAccount]);

  const submitCreate = async (e) => {
    e.preventDefault();
    setNewKeyboard("");

    if (!ethereum) {
      console.error("Ethereum object is required to create a keyboard");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const keyboardsContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const createTxn = await keyboardsContract.create(newKeyboard);
    console.log("Create transaction started...", createTxn.hash);

    await createTxn.wait();
    console.log("Created keyboard!", createTxn.hash);

    await getKeyboards();
  };

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
    <div className="flex flex-col gap-y-8">
      <form className="flex flex-col gap-y-2">
        <div>
          <label
            htmlFor="keyboard-description"
            className="block text-sm font-medium text-gray-700"
          >
            Keyboard Description
          </label>
        </div>
        <input
          name="keyboard-type"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={newKeyboard}
          onChange={(e) => {
            setNewKeyboard(e.target.value);
          }}
        />
        <PrimaryButton type="submit" onClick={submitCreate}>
          Create Keyboard!
        </PrimaryButton>
      </form>
      <div>
        {keyboards.map((keyboard, i) => (
          <p key={i}>{keyboard}</p>
        ))}
      </div>
    </div>
  );
}
