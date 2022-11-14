// This script is used to cast a vote on a proposal in the TokenizedBallot
// usage: yarn run ts-node --files ./scripts/CastMyVote.ts <ballot contract address> <vote # (0-5)> <token amount in ether>

import { BigNumber, ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
    dotenv.config();

// Timestamp used to measure rough performance of this software execution on-chain
    require('log-timestamp');

// Main function for this script
async function main() {
    
    // Start timer to measure elapsed time for the dry run
        const start = Date.now();

    // Parse command line arguments
        console.log("Voting on proposals using TokenBallot smart contract...\n");
        const contractAdress = process.argv[2];
        const votedOnProposal = process.argv[3];
        const tokenAmount = ethers.utils.parseEther(process.argv[4]);
    
    // Set up a Provider
        console.log("Setting up Alchemy provider with Goerli testnet...\n");    
        const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
        const network = await provider.getNetwork();
    
    // connect Wallet to the Provider
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
        const signer = wallet.connect(provider);
        const balance = await signer.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
        if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Attach to the token contract factory
        const tokenBallotContractFactory = new TokenizedBallot__factory(signer);
        const tokenBallotContract = await tokenBallotContractFactory.attach(contractAdress);
        const voteTx = await tokenBallotContract.vote(votedOnProposal, tokenAmount);
        await voteTx.wait();
        console.log(`voted on proposal ${votedOnProposal} with ${tokenAmount} tokens\n`)
        console.log(`Transaction hash: ${voteTx.hash}\n`)

    // Elapsed time for the dry run
        let end = Date.now();
        let elapsed = end - start;
        console.log(`Elapsed time for the dry run: ${elapsed/1000} seconds.\n`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
