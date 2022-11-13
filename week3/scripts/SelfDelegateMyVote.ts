// This script self delegates voting power for a given set of accounts all at once, like an auto self delegate 
// usage: yarn run ts-node --files <*SelfDelegateMyVote.ts> <token contract address> <self delegate account address> <address key #>

import { ethers, Signer, Wallet } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
dotenv.config();

// Timestamp used to measure rough performance of this software execution on-chain
require('log-timestamp');

// Main function for this script
// Usage: yarn run ts-node --files <dir>/SelfDelegateMyVote.ts <contractAddress> <selfDelegateAddress> <addressLookup>
async function main() {
    
    // Start timer to measure elapsed time for the dry run
       const start = Date.now();

    // Parse the token smart contract address from command line arguments
       const contractAdress = process.argv[2];
        
    // set up a Provider
        const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
        const network = await provider.getNetwork();
       
    // Preserve the immutability of the Signers; ensure proper initialization while cycling through the accounts
        const basepathstr = "m/44'/60'/0'/0/"
        var signer: Signer[] = new Array(4);
    
    // Cycle through the accounts and initialize the signers
        for( let index = 0; index < 4; index++ ) {
            signer[index] = (ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", basepathstr+index.toString())).connect(provider);
            console.log(`Account${index}: ${await (signer[index]).getAddress()}  Balance: ${await (signer[index]).getBalance()} wei`); 
        }
     
    // connect to  MyToken smart contract factory
        const tokenContractFactory = new MyToken__factory(signer[1]);
        const tokenContract = await tokenContractFactory.attach(contractAdress);

    // Check the account balance before self-delegation
        console.log(`----------------------------------\n`);
        console.log(`Checking Token balances of all the accounts before self-delegation...`);
        for(let index = 0; index < signer.length; index++){
            var balance = await tokenContract.balanceOf(signer[index].getAddress());
            console.log(`Account${index}: ${await signer[index].getAddress()} has ${balance.toString()} Tokens before the Self Delegate`)
        }

    // Self delegate
        console.log(`----------------------------------\n`);
        console.log(`Initiating self-delegation of all the accounts...`);  
        for(let index = 0; index < signer.length; index++){
            var delegateTx = await tokenContract.connect(signer[index]).delegate(signer[index].getAddress());
            var balance = await tokenContract.balanceOf(signer[index].getAddress());
            console.log(`Account${index}: ${await signer[index].getAddress()} has ${balance.toString()} Tokens after the Self Delegate`)
        }
        
   // Check the voting power after self-delegation
        console.log(`----------------------------------\n`);
        console.log(`Checking voting power of all the accounts after self-delegation...`);     
        for(let index = 0; index < signer.length; index++){
            var votingPower = await tokenContract.getVotes((signer[index]).getAddress());
            console.log(`Account${index}: ${await signer[index].getAddress()} has ${votingPower.toString()} Tokens after the Self Delegate`)
        }

    // Elapsed time for the dry run
        console.log(`----------------------------------\n`);
        let end = Date.now();
        let elapsed = end - start;
        console.log(`Elapsed time for the dry run: ${elapsed/1000} seconds.\n`)
}

//  Log and exit on error
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})