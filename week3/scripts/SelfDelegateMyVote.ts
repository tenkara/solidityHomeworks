// This script self delegates voting power for a given account 
// usage: yarn run ts-node --files <*SelfDelegateMyVote.ts> <MyToken contract address> <account address for which to self-delegate voting power>

import { ethers, Wallet } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
dotenv.config();

// Main function for this script
// Usage: yarn run ts-node --files <dir>/SelfDelegateMyVote.ts <contractAddress> <selfDelegateAddress> <addressLookup>
async function main() {
    // Parse the proposals from command line arguments
    const contractAdress = process.argv[2];
    const selfDelegateAddress = process.argv[3];
    const addressLookup = process.argv[4] || "4";
    console.log(`private key address will be set to key number ${addressLookup}`);

    console.log(`Self delegate voting power of account ${selfDelegateAddress} for smart contract at ${contractAdress} using address key ${addressLookup}...\n`);
    
    // set up a Provider
    const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const network = await provider.getNetwork();
    let wallet: Wallet;
    // connect Wallet to the Provider
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ENCODE_BC ?? "");
    switch (addressLookup) {
        case "1": wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
        case "2": wallet = new ethers.Wallet(process.env.PRIVATE_KEY_2 ?? "");
        case "3": wallet = new ethers.Wallet(process.env.PRIVATE_KEY_3 ?? "");
        case "4": wallet = new ethers.Wallet(process.env.PRIVATE_KEY_4 ?? "");
        default : wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
    }
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
    if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // connect to  MyToken smart contract factory
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = await tokenContractFactory.attach(contractAdress);

    // Check the account balance before self-delegation
    const balanceBefore = await tokenContract.balanceOf(selfDelegateAddress);
    console.log(`Account ${selfDelegateAddress} has a balance of ${balanceBefore.toString()} MyTokens before the Self Delegate\n`) 

    // Check the voting power before self-delegation
    const votingPowerBefore = await tokenContract.getVotes(selfDelegateAddress);
    console.log(
        `Account ${selfDelegateAddress} has ${votingPowerBefore.toString()} of MyTokens voting power before self delegating\n`
    );
    // Self delegate
    const delegateTx = await tokenContract.delegate(selfDelegateAddress);
 
   // Check the voting power after self-delegation
   const votingPowerAfter = await tokenContract.getVotes(selfDelegateAddress);
   console.log(
       `Account ${selfDelegateAddress} has ${votingPowerAfter.toString()} of MyTokens voting power after self delegating\n`
   );

   // Warn the user about the account owner detail with self delegation
   if ((votingPowerAfter.sub(votingPowerBefore)).eq(0)) {
    console.log(`No change in the voting power! Double check that the account used to connect a wallet to the provider is the same account to self-delegate\n`);
   }
        
   // Check the account balance before the Mint
   const balanceAfter = await tokenContract.balanceOf(selfDelegateAddress);
   console.log(`Account ${selfDelegateAddress} has a balance of ${balanceAfter.toString()} MyTokens before the Self Delegate\n`) 
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})