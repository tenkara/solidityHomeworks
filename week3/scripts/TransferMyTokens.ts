// This script transfers tokens between two accounts 
// usage: yarn run ts-node --files <*TransferMyTokens.ts> <MyToken contract address> <from account address> <to account address> <transfer amount in ethers> <privateKeyIndex>

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
    const transferFrom = process.argv[3];
    const transferTo = process.argv[4];
    let transferAmount = ethers.utils.parseEther(process.argv[5]);
    const privateKeyIndex = process.argv[6] || "4";
    console.log(`private key address will be set to key number ${privateKeyIndex}`);

    console.log(`Transfer from account ${transferFrom} to account ${transferTo} using smart contract at ${contractAdress} using private key index ${privateKeyIndex}...\n`);
    
    // set up a Provider
    const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const network = await provider.getNetwork();
    let wallet: Wallet;
    // connect Wallet to the Provider
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ENCODE_BC ?? "");
    switch (privateKeyIndex) {
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

    // Check the fromAccount balance before transfer
    let transferFromTokenBalance = await tokenContract.balanceOf(transferFrom);
    console.log(`Account ${transferFrom} has a balance of ${transferFromTokenBalance.toString()} MyTokens before the Transfer\n`) 

    // Check the fromAccount voting power before transfer
    let transferFromVotingPower = await tokenContract.getVotes(transferFrom);
    console.log(
        `Account ${transferFrom} has ${transferFromVotingPower.toString()} of MyTokens voting power before the Transfer\n`
    );

    // Check the toAccount balance before transfer
    let transferToTokenBalance = await tokenContract.balanceOf(transferTo);
    console.log(`Account ${transferTo} has a balance of ${transferToTokenBalance.toString()} MyTokens before the Transfer\n`) 

    // Check the toAccount voting power before transfer
    let transferToVotingPower = await tokenContract.getVotes(transferTo);
    console.log(
        `Account ${transferTo} has ${transferToVotingPower.toString()} of MyTokens voting power before the Transfer\n`
    );

    // Transfer Transaction

    // Ensure the token amount to transfer does not exceed the amount available to transfer
    if(transferFromTokenBalance.lt(transferAmount)) {
        transferAmount = transferFromTokenBalance;
    }

    console.log(
        `Transfer of ${transferAmount} MyTokens from Account ${transferFrom} 
                                         to Account ${transferTo} in progress...\n`
    );

    // const transferTx = await tokenContract
    // .attach(transferFrom)
    // .transfer(transferTo, transferAmount, transferFrom);
    const transferTx = await tokenContract.connect("0xF9bde57c9978d80911814B7e10A8Ee402d75bb25")
    .transferFrom(transferFrom, transferTo, transferAmount);
   
    await transferTx.wait();
    console.log(`Transfer transaction hash: ${transferTx.hash}`);

    // Check the fromAccount balance after transfer
    transferFromTokenBalance = await tokenContract.balanceOf(transferFrom);
    console.log(`Account ${transferFrom} has a balance of ${transferFromTokenBalance.toString()} MyTokens after the Transfer\n`) 

    // Check the fromAccount voting power after transfer
    transferFromVotingPower = await tokenContract.getVotes(transferFrom);
    console.log(
        `Account ${transferFrom} has ${transferFromVotingPower.toString()} of MyTokens voting power after the Transfer\n`
    );

    // Check the toAccount balance after transfer
    transferToTokenBalance = await tokenContract.balanceOf(transferTo);
    console.log(`Account ${transferTo} has a balance of ${transferToTokenBalance.toString()} MyTokens after the Transfer\n`) 

    // Check the toAccount voting power after transfer
    transferToVotingPower = await tokenContract.getVotes(transferTo);
    console.log(
        `Account ${transferTo} has ${transferToVotingPower.toString()} of MyTokens voting power after the Transfer\n`
    );

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})