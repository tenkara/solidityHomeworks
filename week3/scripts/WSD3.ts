// Demonstrates an end-to-end working of the Token and Ballot smart contracts resulting in a winning proposal
// Usage yarn run ts-node --files .\scripts\WSD3.ts
// Note: It takes roughly around 30 minutes to complete a run on Goerli testnet

// Essential imports
    import { ethers } from "ethers";
    import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
    import * as dotenv from "dotenv";

// Read the environment into this script
    dotenv.config();

// Timestamp used to measure rough performance of this software execution on-chain
    require('log-timestamp');

// Used to mint tokens worth 10 testnet Ether
    const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    // set up a Provider
        const provider = ethers.getDefaultProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
        const network = await provider.getNetwork();

    // connect Wallet to the Provider
        const wallet1 = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
        const signer1 = wallet1.connect(provider);
        const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY_2 ?? "");
        const signer2 = wallet2.connect(provider);

        const balance1 = await signer1.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer1.address} and a balance of ${balance1}\n`);
        if(balance1.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");
        const balance2 = await signer2.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer2.address} and a balance of ${balance2}\n`);
        if(balance2.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Deploy the token contract factory
    
        console.log("\n--------------------------------------------------------------\n");
        console.log(`\nInitiating token contract deployment...\n`);
        const tokenContractFactory = new MyToken__factory(signer1);
        const tokenContract = await tokenContractFactory.deploy();
        await tokenContract.deployed();
    
        console.log("\n--------------------------------------------------------------\n");
        console.log(`\nToken contract deployed at ${tokenContract.address}\n`);
        
    // Check the accounts' token balance before the Mint
        let acc1Balance = await tokenContract.balanceOf(signer1.address);
        let acc2Balance = await tokenContract.balanceOf(signer2.address);
        console.log(`Account ${signer1.address} has a token balance of ${acc1Balance.toString()} before Mint\n`)
        console.log(`Account ${signer2.address} has a token balance of ${acc2Balance.toString()} before Mint\n`)
        
    // Mint tokens for account 1
        let mintTx = await tokenContract.mint(signer1.address, MINT_VALUE);
        await mintTx.wait()
        console.log(`Minted ${MINT_VALUE.toString()} tokens to account ${signer1.address}\n`);

    // Mint tokens for account 2
        mintTx = await tokenContract.mint(signer2.address, MINT_VALUE);
        await mintTx.wait()
        console.log(`Minted ${MINT_VALUE.toString()} tokens to account ${signer2.address}\n`);
        
    // Check the token balances after the Mint
        acc1Balance = await tokenContract.balanceOf(signer1.address);
        acc2Balance = await tokenContract.balanceOf(signer2.address);
        console.log(`Account ${signer1.address} has a token balance of ${acc1Balance.toString()} after Mint\n`)
        console.log(`Account ${signer2.address} has a token balance of ${acc2Balance.toString()} after Mint\n`)
        
    // Check the voting power before self delegating for both accounts
        let acc1VP = await tokenContract.getVotes(signer1.address);
        let acc2VP = await tokenContract.getVotes(signer2.address);
        console.log(
            `Account ${signer1.address} has ${acc1VP.toString()} of voting power before self delegating\n`
        );
        console.log(
            `Account ${signer2.address} has ${acc2VP.toString()} of voting power before self delegating\n`
        );
        
    // Self delegate for account 1
        console.log(
            `Self delegation for Account ${signer1.address} in progress...\n`
        );
        const delegateTx1 = await tokenContract.connect(signer1).delegate(signer1.address);
        await delegateTx1.wait();
        
    // Self delegate for account 2
        console.log(
            `Self delegation for Account ${signer2.address} in progress...\n`
        );
        const delegateTx2 = await tokenContract.connect(signer2).delegate(signer2.address);
        await delegateTx2.wait();
        
    // Check the voting power after self delegating for both accounts
        acc1VP = await tokenContract.getVotes(signer1.address);
        console.log(
            `Account ${
                signer1.address
            } has ${acc1VP.toString()} voting power after self delegating\n`
        );
        acc2VP = await tokenContract.getVotes(signer2.address);
        console.log(
            `Account ${
                signer2.address
            } has ${acc2VP.toString()} voting power after self delegating\n`
        );

    // Check past voting power
        const lastBlock = await provider.getBlock("latest");
        console.log(`Current block number is ${lastBlock.number}\n`);
        let pastVotes = await tokenContract.getPastVotes(signer1.address, lastBlock.number - 1);
        console.log(
            `Account ${signer1.address} had ${pastVotes.toString()} voting power at previous block\n`)
        pastVotes = await tokenContract.getPastVotes(signer2.address, lastBlock.number - 1);
            console.log(
            `Account ${signer2.address} had ${pastVotes.toString()} of voting power at previous block\n`)
        console.log("\n--------------------------------------------------------------\n");

    // Deploy TokenBallot contract
        console.log(`Preparing to deploy Token Ballot smart contract...\n`);
        const proposals = ["Ironman", "captainAmerica", "Spiderman", "captainMarvel", "Wanda", "BlackWidow" ];
        console.log(`With proposals : \n`);
        proposals.forEach((element, index) => {
            console.log(`Proposal N. ${index}: ${element}`);
        });
        console.log(`\nInitiating token contract deployment...\n`);
        const ballotContractFactory = new TokenizedBallot__factory(signer1);
        const ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(proposals), tokenContract.address, lastBlock.number - 1);
        await ballotContract.deployed();
    
        console.log(`\nBallot contract deployed at ${ballotContract.address}\n`);

    // Let the voting begin
        console.log(`Begin voting...\n`);
        console.log(`Now voting: ${signer1.address}\n`);
        const v1Tx = await ballotContract.connect(signer1).vote(1, 1);
        await v1Tx.wait();
        console.log(`Now voting: ${signer2.address}\n`);
        const v2Tx = await ballotContract.connect(signer2).vote(1, 1);
        await v2Tx.wait();

    // Print the winning proposal
        const winningProposal = await ballotContract.winningProposal();
        const winnerName = ethers.utils.parseBytes32String(await ballotContract.winnerName());
        console.log(`Winning proposal: ${winningProposal}, Winner name: ${winnerName}`);
        console.log("\n--------------------------------------------------------------\n");
}

// conversion used to process the proposals from String array to Bytes32 array
    function convertStringArrayToBytes32(array: string[]) {
        const bytes32Array = [];
        for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
        }
        return bytes32Array;
    }

//  Log and exit on error
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })