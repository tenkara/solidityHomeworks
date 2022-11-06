import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    const contractAdress = process.argv[2];
    const targetAddress = process.argv[3];
    
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
//    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ENCODE_BC ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);
    const balance = await signer.getBalance();
    console.log(`This address has a balance of ${balance} wei units`);
    if(balance.eq(0)) throw new Error("I'm too poor");
    // No longer need the below hardhat function as we are directly gettting accounts from ethers instead of hardhat
    // const accounts = await ethers.getSigners();
    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.attach(
        contractAdress);
    const tx = await ballotContract.giveRightToVote(targetAddress);
    await tx.wait();
    console.log(`Done! Transaction hash: ${tx.hash}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});