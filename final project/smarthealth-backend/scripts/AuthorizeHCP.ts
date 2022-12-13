import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
import { SmartHealth__factory } from "../typechain-types";

dotenv.config();

function convertToByte32(obj: string) {
  return ethers.utils.formatBytes32String(obj);
}

const PRIVATE_KEY_PATIENT = process.env.PRIVATE_KEY || "";
const HCP_NAME = "St. Michael's Hospital";
const HCP_NAME1 = "Lenox Hill Hospital";
const HCP_ADDRESS = "0x5a22277Cb15c24c381f8c07A3bdF430D2c004A2b";

const contractAddress = "0x1D36cf950BF2b5cC0C36267f46985ec45767fC0C";
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
  let hcpName = HCP_NAME;
  let infoToAuth = "Patient authorization";
  let reason = "primary care doctor";
  let hcpAddress = HCP_ADDRESS;

  const authTx = await smartHealthContract.authorizeProvider(
    convertToByte32(hcpName),
    convertToByte32(infoToAuth),
    convertToByte32(reason),
    hcpAddress,
    {
      gasLimit: 6000000,
    }
  );
  const receipt = await authTx.wait();
  console.log(`Hash of tx authorization = ${receipt.transactionHash}`);
  console.log(
    `Patient has authorized a health care provider with name ${HCP_NAME1} and address ${hcpAddress}.`
  );
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
