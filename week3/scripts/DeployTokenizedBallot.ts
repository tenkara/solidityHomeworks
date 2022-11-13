// This script deploys a Ballot contract containing proposals 
// created by passing them in as arguments from the command line
import { ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

// Main function for this script
async function main() {
    
    console.log("Deploying TokenBallot smart contract...");
    console.log("Proposals: ");
    const proposals = process.argv.slice(2);
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    
    // set up a Provider
    const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const network = await provider.getNetwork();
    
    // connect Wallet to the Provider
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_4 ?? "");
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
    if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Deploy the token contract factory
    const tokenBallotContractFactory = new TokenizedBallot__factory(signer);
    const tokenBallotContract = await tokenBallotContractFactory
    .deploy(
        convertStringArrayToBytes32(proposals),
        "0xaD949E6AD3203BE45a447307482193A9D69025F4",
        7936868
        );
    await tokenBallotContract.deployed();
    console.log(`TokenBallot smart contract is deployed at ${tokenBallotContract.address}\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})