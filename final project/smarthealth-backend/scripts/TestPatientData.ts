import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { SmartHealth__factory } from '../typechain-types';
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const contractAddress = '0xAc749f04A21cF9B80597E7bf37ffAaE2399AA63E';
console.log(`Smart Contract deployed at ${contractAddress}`);

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

async function main() {
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API,
  });
  const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

  const tokenContractFactory = new SmartHealth__factory(deployer);
  const tokenContract = tokenContractFactory.attach(contractAddress);

  //Get Patient info:
  const patientData = await tokenContract.getPatientSummary();

  //Get Patient vitals:
  const patientVitals = await tokenContract.getPatientVitals();

  //Display Patient's Info:
  console.log(`Display patient info for: ${deployer.address}`);
  DisplayPatientData(patientData);
  DisplayPatientVital(patientVitals);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});