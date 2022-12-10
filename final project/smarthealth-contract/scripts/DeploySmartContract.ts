import { Bytes, ethers } from "ethers";
import { SmartHealth__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import internal from "stream";
import { string } from "hardhat/internal/core/params/argumentTypes";
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

function convertObjectsByte32(obj1: object, obj2: object) {
  let arr1 = convertObjectByte32(obj1);
  let arr2 = convertObjectByte32(obj2);

  return arr1.concat(arr2);
}

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

//Patient Information:
// type PatientInfo = {
//   name: string;
//   age: number;
//   birthSex: string;
//   weight: number;
// };

// //Patient's vital:
// type PatientVital = {
//   heartRate: number;
//   oxygenSat: number;
//   temperature: number;
// };

//Input Parameters:
let person = { name: "Jorge", age: "34", birthSex: "Male", weight: "190" };
let personVital = {
  heartRate: "75",
  bloodPressure: "12/80",
  oxygenSat: "98",
  temperature: "99.5",
};

async function main() {
  console.log("Script to deploy smart contract");

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API,
  });
  const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

  const smartHealthContractFactory = new SmartHealth__factory(deployer);
  const smartHealthContract = await smartHealthContractFactory.deploy(
    convertObjectsByte32(person, personVital),
    {
      gasLimit: 6000000,
    }
  );

  console.log("Smart Contract Deployed");
  console.log(`PatientAddress: ${deployer.address}`);
  console.log(`SmartContractAddress: ${smartHealthContract.address}`);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
