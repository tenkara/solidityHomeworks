// This script is used to cast a vote on a proposal in the TokenizedBallot
// Pass in the TokenizedBallot contract address as the first argument
// Pass in the vote on a proposal as the second argument

import { BigNumber, ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
dotenv.config();

// Main function for this script
async function main() {
    
    console.log("Voting on proposals using TokenBallot smart contract...\n");
    const contractAdress = process.argv[2];
    const votedOnProposal = uint256(process.argv[3]);
    const tokenAmount = ethers.utils.parseEther(process.argv[4]);
    
    // set up a Provider
    const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const network = await provider.getNetwork();
    
    // connect Wallet to the Provider
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_4 ?? "");
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
    if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Deploy the token contract factory
    const tokenBallotContractFactory = new TokenizedBallot__factory(signer);
    const tokenBallotContract = await tokenBallotContractFactory.attach(contractAdress);
    const voteTx = await tokenBallotContract.vote(votedOnProposal, tokenAmount);
    await voteTx.wait();
    console.log(`voted on proposal ${votedOnProposal} with ${tokenAmount} tokens\n`)
    console.log(`Transaction hash: ${voteTx.hash}\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})

function uint256(arg0: string) {
    throw new Error("Function not implemented.");
}
