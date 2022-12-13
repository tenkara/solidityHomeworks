import { ethers, Wallet } from 'ethers';
import * as dotenv from 'dotenv';
import { SmartHealth__factory } from '../typechain-types';

dotenv.config();

function convertObjectByte32(obj: object) {
  let objArray = Object.values(obj);

  //convert array into bytes32:
  return objArray.map((item) => {
    if (typeof item === 'number') {
      return ethers.utils.hexZeroPad(ethers.utils.hexlify(item), 32);
    } else {
      return ethers.utils.formatBytes32String(item);
    }
  });
}
function DisplayPatientData(patientSummary: any) {
  console.log(`Name: ${ethers.utils.parseBytes32String(patientSummary[0])}`);
  console.log(`Age: ${ethers.utils.parseBytes32String(patientSummary[1])}`);
  console.log(
    `Birthsex: ${ethers.utils.parseBytes32String(patientSummary[2])}`
  );
  console.log(`Weight: ${ethers.utils.parseBytes32String(patientSummary[3])}`);
}

function DisplayPatientVital(patientVital: any) {
  console.log(`heartRate: ${ethers.utils.parseBytes32String(patientVital[0])}`);
  console.log(
    `bloodPressure: ${ethers.utils.parseBytes32String(patientVital[1])}`
  );
  console.log(`oxygenSat: ${ethers.utils.parseBytes32String(patientVital[2])}`);
  console.log(
    `temperature: ${ethers.utils.parseBytes32String(patientVital[3])}`
  );
}

const PRIVATE_KEY_HCP = process.env.PRIVATE_KEY_HCP || "";
const contractAddress = "0xAc749f04A21cF9B80597E7bf37ffAaE2399AA63E";
const HCP_NAME = "St. Michael's Hospital";

async function main() {
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API,
  });
  const deployer = new ethers.Wallet(PRIVATE_KEY_HCP, provider);

  console.log(`Smart Contract deployed at ${contractAddress}`);
  const tokenContractFactory = new SmartHealth__factory(deployer);
  const tokenContract = tokenContractFactory.attach(contractAddress);

  //Get Patient info:
  // const patientData = await tokenContract.getPatientVitalsHCP(
  //   convertObjectByte32({ hcpName: HCP_NAME })
  // );

  //Get Patient vitals:
  // const patientVitals = await tokenContract.getPatientSummaryHCP(
  //   convertObjectByte32({ hcpName: HCP_NAME })
  // );

  //Display Patient's Info:
  console.log(
    `Display patient info for: ${deployer.address} as requested by ${HCP_NAME}`
  );
  // DisplayPatientData(patientData);
  // DisplayPatientVital(patientVitals);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});