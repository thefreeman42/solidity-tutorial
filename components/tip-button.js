import { useState } from "react";
import SecondaryButton from "./secondary-button";
import { ethers } from "ethers";
import getContract from "../utils/getContract";

export default function TipButton({ contract, index }) {
  const [mining, setMining] = useState(false);

  const submitTip = async (e) => {
    if (!contract) {
      console.error("Contract object required to submit a tip");
      return;
    }

    setMining(true);
    try {
      const tipTxn = await contract.tip(index, {
        value: ethers.utils.parseEther("0.01"),
      });
      console.log("Tip transaction started...", tipTxn.hash);

      await tipTxn.wait();
      console.log("Sent tip!", tipTxn.hash);
    } finally {
      setMining(false);
    }
  };

  return (
    <SecondaryButton onClick={submitTip} disabled={mining}>
      {mining ? "Tipping..." : "Tip 0.01 eth!"}
    </SecondaryButton>
  );
}
