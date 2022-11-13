// This script mints tokens for a input set of ether and account to a Goerli Testnet 
// Usage: yarn run ts-node --files <*MintTokens.ts> <contractAddress> <etherAmount> <mint to address>
// Typical mint time per address is around 15s

// Essential imports
import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
    dotenv.config();

// Timestamp used to measure rough performance of this software execution on-chain
    require('log-timestamp');

// Main thinge
async function main() {
    
    // Start timer to measure elapsed time for the dry run
        const start = Date.now();

    // Parse the proposals from command line arguments
        const contractAdress = process.argv[2];
        const tokenAmount = ethers.utils.parseEther(process.argv[3]);
        const mintToAddress = process.argv[4];
        console.log(`Minting tokens with ${tokenAmount} ether using MyToken smart contract at ${contractAdress} for account ${mintToAddress}\n`);
    
    // set up a Provider
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

    // Attach to  MyToken smart contract factory
        console.log("Attaching to an existing token contract...\n");
        const tokenContractFactory = new MyToken__factory(signer);
        const tokenContract = await tokenContractFactory.attach(contractAdress);
    
    // Check the account balance before the Mint
        const balanceBefore = await tokenContract.balanceOf(mintToAddress);
        console.log(`Account ${mintToAddress} has a balance of ${balanceBefore.toString()} MyTokens before the Mint\n`) 
    
    // Mint some tokens
        const mintTx = await tokenContract.mint(mintToAddress, tokenAmount);
        await mintTx.wait()
        console.log(`Minted ${tokenAmount} of Tokens to account ${mintToAddress}\n`);
        console.log(`Transaction hash is ${mintTx.hash}\n`)
    
    // Token balance of the account the tokens were minted to
        const balanceAfter = await tokenContract.balanceOf(mintToAddress);
        console.log(`Account ${mintToAddress} has a balance of ${balanceAfter} of MyTokens after the Mint`)

    // Elapsed time for the dry run
        let end = Date.now();
        let elapsed = end - start;
        console.log(`Elapsed time for the dry run: ${elapsed/1000} seconds.\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})