// This script mints tokens for a input set of ether and account to a Goerli Testnet 
// Usage: yarn run ts-node --files <*MintTokens.ts> <contractAddress> <etherAmount> <tokenAddress>

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
    const tokenAmount = ethers.utils.parseEther(process.argv[3]);
    const tokensAddress = process.argv[4];
    console.log(`Minting tokens with ${tokenAmount} ether using MyToken smart contract at ${contractAdress} for account ${tokensAddress}`);
    
    // set up a Provider
    const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const network = await provider.getNetwork();
    
    // connect Wallet to the Provider
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ENCODE_BC ?? "");
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
    if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Attach to  MyToken smart contract factory
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = await tokenContractFactory.attach(contractAdress);
    // Mint some tokens
    const mintTx = await tokenContract.mint(tokensAddress, tokenAmount);
    await mintTx.wait()
    console.log(`Minted ${tokenAmount} of MyTokens to account ${tokensAddress}\n`);
    console.log(`Transaction hash is ${mintTx.hash}\n`)
    }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})