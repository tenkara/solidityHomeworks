// Demonstrates an end-to-end working of the Token and Ballot smart contracts resulting in a winning proposal
// Usage yarn run ts-node --files .\scripts\WSD3.ts
// Note: It now takes just under 3 minutes to complete a dry run on Goerli testnet

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

// Keep the main thing the main thing 
    async function main() {
    
    // Start timer to measure elapsed time for the dry run
        const start = Date.now();

    // set up a Provider and Network
        console.log("--------------------------------------------------------------\n");
        console.log(`Starting WSD 3 dry run: Solidity bootcamp week 3 homework...\n`);
        console.log("--------------------------------------------------------------\n");
        console.log("Setting up Alchemy provider with Goerli testnet...\n");    
        const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
        const network = await provider.getNetwork();

    // connect Wallet to the Provider #sign-in
        console.log("Connecting to a wallet...\n");
        const wallet1 = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
        const signer1 = wallet1.connect(provider);
        const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY_2 ?? "");
        const signer2 = wallet2.connect(provider);
        const wallet3 = new ethers.Wallet(process.env.PRIVATE_KEY_3 ?? "");
        const signer3 = wallet3.connect(provider);
        const wallet4 = new ethers.Wallet(process.env.PRIVATE_KEY_4 ?? "");
        const signer4 = wallet4.connect(provider);

    // Check eth balance for all accounts
        const balance1 = await signer1.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer1.address} and a balance of ${balance1}\n`);
        if(balance1.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");
        const balance2 = await signer2.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer2.address} and a balance of ${balance2}\n`);
        if(balance2.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");
        const balance3 = await signer3.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer3.address} and a balance of ${balance3}\n`);
        if(balance3.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");
        const balance4 = await signer4.getBalance();
        console.log(`Connected to the provider ${network.name} with wallet ${signer4.address} and a balance of ${balance4}\n`);
        if(balance4.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");

    // Deploy the token contract factory
        console.log(`Initiating token contract deployment...\n`);
        const tokenContractFactory = new MyToken__factory(signer1);
        const tokenContract = await tokenContractFactory.deploy();
        await tokenContract.deployed();
        console.log("--------------------------------------------------------------\n");
        console.log(`Token contract deployed at ${tokenContract.address}\n`);
        console.log("--------------------------------------------------------------\n");

    // Check token balance for accounts before the Mint
        let acc1Balance = await tokenContract.balanceOf(signer1.address);
        let acc2Balance = await tokenContract.balanceOf(signer2.address);
        let acc3Balance = await tokenContract.balanceOf(signer3.address);
        let acc4Balance = await tokenContract.balanceOf(signer4.address);
        console.log(`Account ${signer1.address} has a token balance of ${acc1Balance.toString()} before Mint\n`)
        console.log(`Account ${signer2.address} has a token balance of ${acc2Balance.toString()} before Mint\n`)
        console.log(`Account ${signer3.address} has a token balance of ${acc2Balance.toString()} before Mint\n`)
        console.log(`Account ${signer4.address} has a token balance of ${acc2Balance.toString()} before Mint\n`)
    
    // Mint tokens for account 1
        let mintTx = await tokenContract.mint(signer1.address, MINT_VALUE);
        await mintTx.wait()
        console.log(`Minted ${MINT_VALUE.toString()} tokens to account ${signer1.address}\n`);

    // Mint tokens for account 2
        mintTx = await tokenContract.mint(signer2.address, MINT_VALUE);
        await mintTx.wait()
        console.log(`Minted ${MINT_VALUE.toString()} tokens to account ${signer2.address}\n`);
    
    // Mint tokens for account 3
        mintTx = await tokenContract.mint(signer3.address, MINT_VALUE);
        await mintTx.wait()
        console.log(`Minted ${MINT_VALUE.toString()} tokens to account ${signer3.address}\n`);
        
    // Mint tokens for account 4
        mintTx = await tokenContract.mint(signer4.address, MINT_VALUE);
        await mintTx.wait()
        console.log(`Minted ${MINT_VALUE.toString()} tokens to account ${signer4.address}\n`);

    // Check token balance for accounts after the Mint
        acc1Balance = await tokenContract.balanceOf(signer1.address);
        acc2Balance = await tokenContract.balanceOf(signer2.address);
        acc3Balance = await tokenContract.balanceOf(signer3.address);
        acc4Balance = await tokenContract.balanceOf(signer4.address);
        console.log(`Account ${signer1.address} has a token balance of ${acc1Balance.toString()} after Mint\n`)
        console.log(`Account ${signer2.address} has a token balance of ${acc2Balance.toString()} after Mint\n`)
        console.log(`Account ${signer3.address} has a token balance of ${acc3Balance.toString()} after Mint\n`)
        console.log(`Account ${signer4.address} has a token balance of ${acc4Balance.toString()} after Mint\n`)
        
    // Check voting power before self delegating
        let acc1VP = await tokenContract.getVotes(signer1.address);
        let acc2VP = await tokenContract.getVotes(signer2.address);
        let acc3VP = await tokenContract.getVotes(signer2.address);
        let acc4VP = await tokenContract.getVotes(signer2.address);
        console.log(`Account ${signer1.address} has ${acc1VP.toString()} of voting power before self delegating\n`);
        console.log(`Account ${signer2.address} has ${acc2VP.toString()} of voting power before self delegating\n`);
        console.log(`Account ${signer3.address} has ${acc3VP.toString()} of voting power before self delegating\n`);
        console.log(`Account ${signer4.address} has ${acc4VP.toString()} of voting power before self delegating\n`);
        
    // Self delegate for account 1
        console.log(`Self delegation for Account ${signer1.address} in progress...\n`);
        const delegateTx1 = await tokenContract.connect(signer1).delegate(signer1.address);
        await delegateTx1.wait();
        
    // Self delegate for account 2
        console.log(`Self delegation for Account ${signer2.address} in progress...\n`);
        const delegateTx2 = await tokenContract.connect(signer2).delegate(signer2.address);
        await delegateTx2.wait();
    
    // Self delegate for account 3
        console.log(`Self delegation for Account ${signer3.address} in progress...\n`);
        const delegateTx3 = await tokenContract.connect(signer3).delegate(signer3.address);
        await delegateTx2.wait();

    // Self delegate for account 4
        console.log(`Self delegation for Account ${signer2.address} in progress...\n`);
        const delegateTx4 = await tokenContract.connect(signer2).delegate(signer2.address);
        await delegateTx4.wait();

    // Check the voting power after self delegating for all accounts
        acc1VP = await tokenContract.getVotes(signer1.address);
        console.log(`Account ${signer1.address} has ${acc1VP.toString()} voting power after self delegating\n`);
        acc2VP = await tokenContract.getVotes(signer2.address);
        console.log(`Account ${signer2.address} has ${acc2VP.toString()} voting power after self delegating\n`);
        acc3VP = await tokenContract.getVotes(signer3.address);
        console.log(`Account ${signer3.address} has ${acc3VP.toString()} voting power after self delegating\n`);
        acc4VP = await tokenContract.getVotes(signer4.address);
        console.log(`Account ${signer4.address} has ${acc4VP.toString()} voting power after self delegating\n`);

    // Check past voting power and slowdown for blocks to be chained in as needed
        const lastBlock = await provider.getBlock("latest");
        console.log(`Last block number is ${lastBlock.number}\n`);
        let pastVotes = await tokenContract.getPastVotes(signer1.address, lastBlock.number - 1);
        console.log(`Account ${signer1.address} had ${pastVotes.toString()} voting power at previous block\n`)
        if (pastVotes.eq(0)) {
            setTimeout(() => {console.log("Slowing down for a few seconds for more on-chain blocks to be produced...\n")}, 10000)
        }
        pastVotes = await tokenContract.getPastVotes(signer2.address, lastBlock.number - 1);
        console.log(`Account ${signer2.address} had ${pastVotes.toString()} of voting power at previous block\n`)
        if (pastVotes.eq(0)) {
            setTimeout(() => {console.log("Slowing down for a few seconds for more on-chain blocks to be produced...\n")}, 10000)
        }
        pastVotes = await tokenContract.getPastVotes(signer3.address, lastBlock.number - 1);
        console.log(`Account ${signer3.address} had ${pastVotes.toString()} of voting power at previous block\n`)
        if (pastVotes.eq(0)) {
            setTimeout(() => {console.log("Slowing down for a few seconds for more on-chain blocks to be produced...\n")}, 10000)
        }
        pastVotes = await tokenContract.getPastVotes(signer4.address, lastBlock.number - 1);
        console.log(`Account ${signer4.address} had ${pastVotes.toString()} of voting power at previous block\n`)
        if (pastVotes.eq(0)) {
            setTimeout(() => {console.log("Slowing down for a few seconds for more on-chain blocks to be produced...\n")}, 10000)
        }

    // Deploy TokenBallot contract
        console.log(`Preparing to deploy Token Ballot smart contract...\n`);
        const proposals = ["Ironman", "CaptainAmerica", "Spiderman", "CaptainMarvel", "Wanda", "BlackWidow" ];
        console.log(`With Superhero proposals : \n`);
        proposals.forEach((element, index) => {
            console.log(`Proposal ${index}: ${element}`);
        });
        console.log(`\nInitiating token contract deployment...\n`);
        const ballotContractFactory = new TokenizedBallot__factory(signer1);
        const ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(proposals), tokenContract.address, lastBlock.number - 1);
        await ballotContract.deployed();
    
        console.log("--------------------------------------------------------------\n");
        console.log(`Ballot contract deployed at ${ballotContract.address}\n`);
        console.log("--------------------------------------------------------------\n");

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
        console.log("--------------------------------------------------------------\n");
        console.log(`Winning proposal: ${winningProposal}, Winner name: ${winnerName}\n`);
        console.log("--------------------------------------------------------------\n");
    
    // Elapsed time for the dry run
        let end = Date.now();
        let elapsed = end - start;
        console.log(`Elapsed time for the dry run: ${elapsed/1000} seconds.\n`)
}

// conversion to process the proposals from String array to Bytes32 array
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