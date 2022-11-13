// This script queries the MyToken smart contract 
// to check MyTokens voting power
// usage: yarn run ts-node --files <*CheckVotingPower.ts> <MyToken contract address> <account address for which to check the voting power>

import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
dotenv.config();

// Main function for this script
// Usage: yarn hardhat run MintTokens.ts <contractAddress> <etherAmount> <tokenAddress> 
async function main() {
    // Parse the proposals from command line arguments
    const contractAdress = process.argv[2];
    const tokensAddress = process.argv[3];
    console.log(`Checking voting power of account ${tokensAddress} for smart contract at ${contractAdress}...\n`);
    
    // set up a Provider
    const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const network = await provider.getNetwork();
    
    // connect Wallet to the Provider
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_4 ?? "");
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
    if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Attach to  MyToken smart contract factory
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = await tokenContractFactory.attach(contractAdress);
    // Mint some tokens
    const votes = await tokenContract.getVotes(tokensAddress);
    console.log(`Account ${tokensAddress} has ${votes.toString()} of MyTokens voting power\n`);
    }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})