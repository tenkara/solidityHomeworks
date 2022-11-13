import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

// const MINT_VALUE = ethers.utils.parseEther("10");
const MINT_VALUE = ethers.utils.parseEther(process.argv[2]);

async function main() {
    const accounts = await ethers.getSigners();
    
    // Deploy the contract
    const contractFactory = new MyToken__factory(accounts[0]);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("\n--------------------------------------------------------------\n");
    console.log(`\nMyToken contract deployed at ${contract.address}\n`);
    
    // Check the account balance before the Mint
    const balanceBefore = await contract.balanceOf(accounts[1].address);
    console.log(`Account ${accounts[1].address} has a balance of ${balanceBefore.toString()} MyTokens before Mint\n`)
    
    // Mint some tokens
    const mintTx = await contract.mint(accounts[1].address, MINT_VALUE);
    await mintTx.wait()
    console.log(`Minted ${MINT_VALUE.toString()} MyTokens to account ${accounts[1].address}\n`);
    
    // Check the account balance after the Mint
    const balanceAfter = await contract.balanceOf(accounts[1].address);
    console.log(`Account ${accounts[1].address} has ${balanceAfter.toString()} MyTokens\n`)
    
    // Check the voting power before self delegating
    const votes = await contract.getVotes(accounts[1].address)
    console.log(
        `Account ${accounts[1].address} has ${votes.toString()} of MyTokens voting power before self delegating\n`
    );
    
    // Self delegate
    const delegateTx = await contract.connect(accounts[1]).delegate(accounts[1].address);
    await delegateTx.wait();
    console.log(
        `Self delegation for Account ${accounts[1].address} in progress...\n`
    );
    
    // Check the voting power after self delegating
    const votesAfter = await contract.getVotes(accounts[1].address);
    console.log(
        `Account ${
            accounts[1].address
        } has ${votesAfter.toString()} of MyTokens voting power after self delegating\n`
    );
    
    //Transfer tokens
    const transferAmount = MINT_VALUE.div(2);
    const tranferTx = await contract
    .connect(accounts[1])
    .transfer(accounts[2].address, transferAmount);
    await tranferTx.wait();
    console.log(
        `Transfer of ${transferAmount} MyTokens from Account ${accounts[1].address} 
                                         to Account ${accounts[2].address} in progress...\n`
    );
    
    // Check the voting power 
    const votes1AfterTransfer = await contract.getVotes(accounts[1].address);
    console.log(
        `Account ${
            accounts[1].address
        } has ${votes1AfterTransfer.toString()} of MyTokens voting power after sending a transfer\n`
    );

    const votes2AfterTransfer = await contract.getVotes(accounts[2].address);
    console.log(
        `Account ${accounts[2].address} has ${votes2AfterTransfer.toString()} of MyTokens voting power after receiving a transfer\n`
    );

    //Check past voting power
    const lastBlock = await ethers.provider.getBlock("latest");
    console.log(`Current block number is ${lastBlock.number}\n`);
    const pastVotes = await contract.getPastVotes(
        accounts[1].address,
        lastBlock.number - 1
    );
    console.log(
        `Account ${accounts[1].address} had ${pastVotes.toString()} of MyTokens voting power at previous block\n`)
    console.log(
        `Account ${accounts[2].address} had ${pastVotes.toString()} of MyTokens voting power at previous block\n`)
    console.log("\n--------------------------------------------------------------\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})