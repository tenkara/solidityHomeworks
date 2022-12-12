import { ethers, Wallet } from 'ethers';
import * as dotenv from "dotenv";
import { SmartHealth__factory } from "../typechain-types";

dotenv.config();

function convertObjectByte32(obj: object) {
  let objArray = Object.values(obj);

  //convert array into bytes32:
  return objArray.map((item) => {
    if (typeof item === "number") {
      return ethers.utils.hexZeroPad(ethers.utils.hexlify(item), 32);
    } else {
      return ethers.utils.formatBytes32String(item);
    }
  });
}

const PRIVATE_KEY_PATIENT = process.env.PRIVATE_KEY || "";
const HCP_NAME = "St. Michael's Hospital";
const HCP_NAME1 = "Lenox Hill Hospital";

const contractAddress = "0xAc749f04A21cF9B80597E7bf37ffAaE2399AA63E";
console.log(`Smart Contract deployed at ${contractAddress}`);

async function main() {
  const provider = await ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API,
  });

  const patient = new ethers.Wallet(PRIVATE_KEY_PATIENT, provider);
  const smartHealthContractFactory = new SmartHealth__factory(patient);

  const smartHealthContract = await smartHealthContractFactory.attach(
    contractAddress
  );

  //Authorize a HCP:
  let providerData = {
    hcpName: HCP_NAME1,
    infoToAuth: "Patient authorization",
    reason: "primary care doctor",
  };
  // const authTx = await smartHealthContract.authorizeProvider(
  //   convertObjectByte32(providerData),
  //   {
  //     gasLimit: 6000000,
  //   }
  // );
  // const receipt = await authTx.wait();
  // console.log(`Hash of tx authorization = ${receipt.transactionHash}`);
  console.log(
    `Patient has authorized a health care provider with name ${HCP_NAME1}.`
  );
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});