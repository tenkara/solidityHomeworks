// This script deploys MyToken smart contract based on ERC20 
// to a Goerli Testnet

import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

// Read the environment into this script
dotenv.config();

// Main function for this script
async function main() {
    
    console.log("Deploying MyToken smart contract...");
    
    // set up a Provider
    const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const network = await provider.getNetwork();
    
    // connect Wallet to the Provider
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ENCODE_BC ?? "");
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
    if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Deploy the token contract factory
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployed();
    console.log(`MyToken smart contract is deployed at ${tokenContract.address}\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})

