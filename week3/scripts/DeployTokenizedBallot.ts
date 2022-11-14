// This script deploys a Ballot contract containing proposals 
// Needs a token contract address as command line argument
// Usage: yarn run ts-node --files .\scripts\DeployTokenizedBallot.ts <token contract address>

// Essential imports
    import { ethers } from "ethers";
    import { TokenizedBallot__factory } from "../typechain-types";
    import * as dotenv from "dotenv";

// Read the environment into this script
    dotenv.config();

// Timestamp used to measure rough performance of this software execution on-chain
    require('log-timestamp');

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

// Main thinge
async function main() {

    // Start timer to measure elapsed time for the dry run
       const start = Date.now();
       console.log("Setting up Alchemy provider with Goerli testnet...\n");  

    // Parse the token contract address from command line arguments
        const tokenContract = process.argv[2];

    // set up a Provider and Network       
       const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
       const network = await provider.getNetwork();

    // connect Wallet to the Provider #sign-in
        console.log("Connecting to a wallet...\n");
        const wallet1 = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
        const signer1 = wallet1.connect(provider);

    // Check eth balance for all accounts
        const balance1 = await signer1.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer1.address} and a balance of ${balance1}\n`);
        if(balance1.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Get the latest block on the chain
        const lastBlock = await provider.getBlock("latest");
        console.log(`Last block number is ${lastBlock.number}\n`);
   
    // Deploy TokenBallot contract
        console.log(`Preparing to deploy Token Ballot smart contract...\n`);
        const proposals = ["Ironman", "CaptainAmerica", "Spiderman", "CaptainMarvel", "Wanda", "BlackWidow" ];
        console.log(`With Superhero proposals : \n`);
        proposals.forEach((element, index) => {
            console.log(`Proposal ${index}: ${element}`);
        });
        console.log(`\nInitiating token ballot contract deployment...\n`);
        const ballotContractFactory = new TokenizedBallot__factory(signer1);
        const ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(proposals), tokenContract, lastBlock.number - 1);
        await ballotContract.deployed();

        console.log("--------------------------------------------------------------\n");
        console.log(`Ballot contract deployed at ${ballotContract.address}\n`);
        console.log("--------------------------------------------------------------\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})