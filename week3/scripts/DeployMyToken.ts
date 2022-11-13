// This script deploys a Token smart contract based on ERC20 
// to a Goerli Testnet

import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
dotenv.config();

// Timestamp used with console.log to measure rough performance of this software execution on-chain
require('log-timestamp');

// Main thinge - thing 1
async function main() {
    
    // Start timer to measure elapsed time for the dry run
        const start = Date.now();
    
    // Set up a Provider and network
        console.log("Setting up Alchemy provider with Goerli testnet...\n");
        const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
        const network = await provider.getNetwork();
    
    // connect Wallet to the Provider
        console.log("Connecting to a wallet...\n");
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
        const signer = wallet.connect(provider);
        const balance = await signer.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
        if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Deploy the token contract factory
        console.log("Initiating Token smart contract deployment...\n");
        const tokenContractFactory = new MyToken__factory(signer);
        const tokenContract = await tokenContractFactory.deploy();
        await tokenContract.deployed();
        console.log("--------------------------------------------------------------\n");
        console.log(`Token contract deployed at ${tokenContract.address}\n`);
        console.log("--------------------------------------------------------------\n");

    // Elapsed time for the dry run
        let end = Date.now();
        let elapsed = end - start;
        console.log(`Elapsed time for the dry run: ${elapsed/1000} seconds.\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})

