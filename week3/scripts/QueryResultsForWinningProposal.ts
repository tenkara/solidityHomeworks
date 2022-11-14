// This script queries the TokenizedBallot for the voting results
// Prints out the winning proposal
// Usage: yarn run ts-node --files .\scripts\QueryResultsForWinningProposal.ts <ballot contract address>

// Essential imports
import { ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
dotenv.config();

// Timestamp used to measure rough performance of this software execution on-chain
require('log-timestamp');

// Keep the main thing the main thing 
async function main() {
    
    // Start timer to measure elapsed time for the dry run
        const start = Date.now();

    // Parse the token smart contract address from command line arguments
       const contractAdress = process.argv[2];

    // set up a Provider and Network
        console.log("--------------------------------------------------------------\n");
        console.log(`Starting to query results from the Ballot smart contract ...\n`);
        console.log("--------------------------------------------------------------\n");
        console.log("Setting up Alchemy provider with Goerli testnet...\n");    
        const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
        const network = await provider.getNetwork();

    // connect Wallet to the Provider #sign-in
        console.log("Connecting to a wallet...\n");
        const wallet1 = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
        const signer1 = wallet1.connect(provider);
    
    // connect to  ballot smart contract factory
        const ballotContractFactory = new TokenizedBallot__factory(signer1);
        const ballotContract = await ballotContractFactory.attach(contractAdress);

    // Print the winning proposal
        const winningProposal = await ballotContract.winningProposal();
        const winnerName = ethers.utils.parseBytes32String(await ballotContract.winnerName());
        console.log("--------------------------------------------------------------\n");
        console.log(`Winning proposal: ${winningProposal}, Winner name: ${winnerName}\n`);
        console.log("--------------------------------------------------------------\n");

    // Elapsed time for the dry run
        let end = Date.now();
        let elapsed = end - start;
        console.log(`Elapsed time for the dry run: ${elapsed/1000} seconds.\n`);
}

//  Log and exit on error
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})