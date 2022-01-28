import { ethers } from "ethers";
import ContractJson from "../utils/Keyboards.json";

const contractAddress = "0x4946607476FC701c07A44cACfC040A0f9da4C654";
const contractAbi = ContractJson.abi;

export default function getContract(ethereum) {
  if (!ethereum) return undefined;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractAbi, signer);
}
