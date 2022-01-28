import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PrimaryButton from "../components/primary-button";
import Keyboard from "../components/keyboard";
import addressesEqual from "../utils/addressesEqual";
import { UserCircleIcon } from "@heroicons/react/solid";
import TipButton from "../components/tip-button";
import { useMetaMaskAccount } from "../components/etherum-context";
import getContract from "../utils/getContract";

export default function Home() {
  const { ethereum, connectedAccount, connectAccount } = useMetaMaskAccount();
  const [keyboards, setKeyboards] = useState([]);
  const [keyboardsLoading, setKeyboardsLoading] = useState(false);

  const keyboardsContract = getContract(ethereum);

  const getKeyboards = async () => {
    if (!ethereum || !connectedAccount) return;

    setKeyboardsLoading(true);
    try {
      const keyboardsOnContract = await keyboardsContract.getKeyboards();
      console.log("Retrieved keyboards...", keyboardsOnContract);
      setKeyboards(keyboardsOnContract);
    } finally {
      setKeyboardsLoading(false);
    }
  };
  const addContractEventHandlers = () => {
    if (keyboardsContract && connectedAccount) {
      keyboardsContract.on("KeyboardCreated", async (keyboard) => {
        if (
          connectedAccount &&
          !addressesEqual(keyboard.owner, connectedAccount)
        ) {
          toast("Somebody created a new keyboard!", {
            id: JSON.stringify(keyboard),
          });
        }
        await getKeyboards();
      });

      keyboardsContract.on("TipSent", (recipient, amount) => {
        if (addressesEqual(recipient, connectedAccount)) {
          toast(
            `You received a tip of ${ethers.utils.formatEther(amount)} eth!`,
            { id: recipient + amount }
          );
        }
      });
    }
  };
  useEffect(() => {
    getKeyboards();
    addContractEventHandlers();
  }, [!!keyboardsContract, connectedAccount]);

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
      <p>{connectedAccount}</p>
      <PrimaryButton type="link" href="/create">
        Create a Keyboard!
      </PrimaryButton>
      {keyboardsLoading && <p>Loading Keyboards...</p>}
      {keyboards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {keyboards.map(([layout, isPBT, filter, owner], i) => (
            <div key={i} className="relative">
              <Keyboard kind={layout} isPBT={isPBT} filter={filter} />
              <span className="absolute top-1 right-6">
                {addressesEqual(owner, connectedAccount) ? (
                  <UserCircleIcon className="h-5 w-5 text-indigo-100" />
                ) : (
                  <TipButton contract={keyboardsContract} index={i} />
                )}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No keyboards yet!</p>
      )}
    </div>
  );
}
