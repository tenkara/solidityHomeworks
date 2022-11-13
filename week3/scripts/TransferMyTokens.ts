// This script transfers tokens between two accounts 
// usage: yarn run ts-node --files <*TransferMyTokens.ts> <MyToken contract address> <from account address> <to account address> <transfer amount in ethers> <privateKeyIndex>

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
    
    // Parse the command line arguments
        const contractAdress = process.argv[2];
        const transferFrom = process.argv[3];
        const transferTo = process.argv[4];
        let transferAmount = ethers.utils.parseEther(process.argv[5]);
        console.log(`Transfering ${transferAmount} ether of tokens from account ${transferFrom} to account ${transferTo} using token contract at ${contractAdress}\n`);

    // set up a Provider
        console.log("Setting up Alchemy provider with Goerli testnet...\n");
        const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
        const network = await provider.getNetwork();
    
    // Preserve the immutability of the Signers; ensure proper initialization while cycling through the accounts
       const basepathstr = "m/44'/60'/0'/0/"
       var signer: Signer[] = new Array(4);
       let transferFromIdx: number = -1;
       let transferToIdx: number = -1;

   // Cycle through the accounts and initialize the signers
        console.log(`----------------------------------\n`);
        console.log("Connecting to  wallet(s)...");
        for( let index = 0; index < 4; index++ ) {
           signer[index] = (ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", basepathstr+index.toString())).connect(provider);
           //addressMap.set((await (signer[index]).getAddress()), index);
           if (await (signer[index]).getAddress() == transferFrom) {transferFromIdx = index};
           if (await (signer[index]).getAddress() == transferTo) {transferToIdx = index};
           console.log(`Account${index}: ${await (signer[index]).getAddress()}  Balance: ${await (signer[index]).getBalance()} wei`);
        }
        console.log(`transferFromIdx: ${transferFromIdx}`);
        console.log(`transferToIdx: ${transferToIdx}`);     

    // Throw error if the transfer addresses are not found in the owner's wallet
        if((transferFromIdx == -1) || (transferToIdx == -1)) throw new Error("Cannot proceed with transfer. Accounts not found in owner's mnemonic\n");

    // connect to  the Token smart contract factory using the from address
        console.log(`----------------------------------\n`);
        console.log("Attaching to token contract with transferFrom address' wallet...");    
        const tokenContractFactory = new MyToken__factory(signer[transferFromIdx]);
        const tokenContract = await tokenContractFactory.attach(contractAdress);

    // Check the fromAccount token balance before transfer
        let transferFromTokenBalance = await tokenContract.balanceOf(transferFrom);
        console.log(`Account ${transferFrom} has a balance of ${transferFromTokenBalance.toString()} MyTokens before the Transfer`) 

    // Check the fromAccount voting power before transfer
        let transferFromVotingPower = await tokenContract.getVotes(transferFrom);
        console.log(
            `Account ${transferFrom} has ${transferFromVotingPower.toString()} of MyTokens voting power before the Transfer`
        );

    // Check the toAccount balance before transfer
        let transferToTokenBalance = await tokenContract.balanceOf(transferTo);
        console.log(`Account ${transferTo} has a balance of ${transferToTokenBalance.toString()} MyTokens before the Transfer`) 

    // Check the toAccount voting power before transfer
        let transferToVotingPower = await tokenContract.getVotes(transferTo);
        console.log(
            `Account ${transferTo} has ${transferToVotingPower.toString()} of MyTokens voting power before the Transfer`
    );

    // Transfer Transaction

    // Ensure the token amount to transfer does not exceed the amount available to transfer
        if(transferFromTokenBalance.lt(transferAmount)) {
            transferAmount = transferFromTokenBalance;
        }

        console.log(
            `Transfer of ${transferAmount} MyTokens from Account ${transferFrom} to Account ${transferTo} in progress...`
        );

        const transferTx = await tokenContract
            .connect(signer[transferFromIdx])
            .transfer(transferTo, transferAmount);

        await transferTx.wait();
        console.log(`Transfer transaction hash: ${transferTx.hash}`);

    // Check the fromAccount balance after transfer
        transferFromTokenBalance = await tokenContract.balanceOf(transferFrom);
        console.log(`Account ${transferFrom} has a balance of ${transferFromTokenBalance.toString()} MyTokens after the Transfer`) 

    // Check the fromAccount voting power after transfer
        transferFromVotingPower = await tokenContract.getVotes(transferFrom);
        console.log(
            `Account ${transferFrom} has ${transferFromVotingPower.toString()} of MyTokens voting power after the Transfer`
        );

    // Check the toAccount balance after transfer
        transferToTokenBalance = await tokenContract.balanceOf(transferTo);
        console.log(`Account ${transferTo} has a balance of ${transferToTokenBalance.toString()} MyTokens after the Transfer`) 

    // Check the toAccount voting power after transfer
        transferToVotingPower = await tokenContract.getVotes(transferTo);
        console.log(
            `Account ${transferTo} has ${transferToVotingPower.toString()} of MyTokens voting power after the Transfer`
        );

    // Elapsed time for the dry run
        let end = Date.now();
        let elapsed = end - start;
        console.log(`Elapsed time for the dry run: ${elapsed/1000} seconds.\n`)
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})