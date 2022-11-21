import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { BigNumber, ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/TokenizedBallot.json'

// import * as dotenv from "dotenv";

export class mintedTokens {
  mintToAddress: Address;
  tokenAmnt: string;
}

export class delegatedTokens {
  delegatee: Address;
}

export class castVoteDto {
  voterAddress: string;
  proposal: string;
  tokenAmount: string;
}

const ER20VOTES_TOKEN_ADDRESS = "0xdC0FF2Ce170c2E1c130960c7E64A2b18eAD3266F";
const BALLOT_ADDRESS = "0x9765fe8fb5642e90982E2C8F5257CF2534F68484";

// Read the environment into this script
// pre-req: install dotenv using yarn add dotenv --dev
// pre-req: add .env file into the project-name directory
// pre-req: ensure .env is ignored in .gitignore to avoid uploading to github
// dotenv.config();

@Injectable()
export class AppService {

  provider: ethers.providers.AlchemyProvider;
  tokenContractFactory: ethers.ContractFactory;
  tokenContract: ethers.Contract;

  ballotContractFactory: ethers.ContractFactory;
  ballotContract: ethers.Contract;

  constructor() {
    // Set up a provider
    this.provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY ?? "");
      
    // Attach to MyToken smart contract facotry with the signer
    this.tokenContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    );
    
    // Token contract instance
    this.tokenContract = this.tokenContractFactory
    .attach(ER20VOTES_TOKEN_ADDRESS)
    .connect(this.provider);
    
  // Attach to Ballot smart contract facotry with the signer
    this.ballotContractFactory = new ethers.ContractFactory(
      ballotJson.abi,
      ballotJson.bytecode,
    );
    
  // Ballot contract instance
    this.ballotContract = this.ballotContractFactory
    .attach(BALLOT_ADDRESS)
    .connect(this.provider);
    }  
  
  getTokenAddress() {
    return ER20VOTES_TOKEN_ADDRESS;
  }

  getBallotAddress() {
    return BALLOT_ADDRESS;
  }

  async getProposals() {
    const props = await this.ballotContract.proposals();
    console.log(`props: ${props}\n`)
    props.forEach((element:string, index:number) => {
      console.log(`Proposal ${index}: ${element}`)
    });
    return props;
  }

  async getWinner() {
    const winningProposal = await this.ballotContract.winningProposal();
    const winnerName = ethers.utils.parseBytes32String(await this.ballotContract.winnerName());
    console.log(`Winning proposal: ${winningProposal}, Winner name: ${winnerName}\n`);
    return winnerName;
  }

  async castVote(voterAddress: string, votedOnProposal:string, tokenAmount:string) {
    
    // Connect Wallet to the provider as voter
    console.log("connecting to a wallet...\n");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_3 ?? "");
    const signer = wallet.connect(this.provider);

    // Signer to send the transaction
    const contractInstance = this.ballotContractFactory
      .attach(BALLOT_ADDRESS)
      .connect(signer);

        // Mint some tokens that matter - let's have a party!!!
      const oneEther = BigNumber.from("1000000000000000000");
      // const mintValue = (ethers.utils.parseEther(amount)).mul(oneEther);
      const tokenValue = (oneEther).mul(tokenAmount);

      const voteTx = await contractInstance.vote(votedOnProposal, tokenValue);
      await voteTx.wait();
      console.log(`voted on proposal ${votedOnProposal} with ${tokenAmount} tokens\n`)
      console.log(`Transaction hash: ${voteTx.hash}\n`)
      return voteTx.hash;
  }


  async requestTokens(toAddress: Address, amount: string) {
    
    // Connect Wallet to the provider as minter
    console.log("connecting to a wallet...\n");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
    const signer = wallet.connect(this.provider);

    // Signer to send the transaction
    const contractInstance = this.tokenContractFactory
      .attach(ER20VOTES_TOKEN_ADDRESS)
      .connect(signer);
    
    // Mint some tokens that matter - let's have a party!!!
    const oneEther = BigNumber.from("1000000000000000000");
    // const mintValue = (ethers.utils.parseEther(amount)).mul(oneEther);
    const mintValue = (oneEther).mul(amount);
    
    // Mint some tokens
    const mintTx = await contractInstance.mint(toAddress, mintValue);
    // const mintTx = await this.tokenContract.mint(toAddress, amount);
    await mintTx.wait()
    console.log(`Minted ${mintValue} tokens for ${amount} Ether to account ${toAddress}\n`);
    console.log(`Transaction hash is ${mintTx.hash}\n`)
    const TxHash: string = mintTx.hash;
    return TxHash;
  }

  async selfDelegate(delegateeAddr: Address) {
     
    // Connect Wallet to the provider as delegatee
     console.log("connecting to a wallet...\n");
     const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_3 ?? "");
     const signer = wallet.connect(this.provider);
 
     // Signer to send the transaction
     const contractInstance = this.tokenContractFactory
       .attach(ER20VOTES_TOKEN_ADDRESS)
       .connect(signer);
    
    //const delegateTx = await contractInstance.delegate(delegateeAddr);
    const delegateTx = await contractInstance.delegate(signer.address);
    await delegateTx.wait();
    const TxHash: string = delegateTx.hash;
    return TxHash;
  }

  async checkVotingPower(accountAddr: string): Promise<number> {
    console.log(`Checking votes for address: ${accountAddr}\n`);
    // const contractInstance = this.tokenContractFactory.attach(ER20VOTES_TOKEN_ADDRESS).connect(this.provider);
    const votes = await this.tokenContract.getVotes(accountAddr);
    console.log(`Account ${accountAddr} has a balance of ${votes} voting power\n`);
    const vPwr = await this.ballotContract.votingPower(accountAddr);
    console.log(`Account ${accountAddr} has a balance of ${vPwr} voting power\n`);
    return parseFloat(ethers.utils.formatEther(vPwr));
  }

  async tokenBalance(accountAddr: string): Promise<number> {
    console.log(`Checking token balance for address: ${accountAddr}\n`);
    // const contractInstance = this.tokenContractFactory.attach(ER20VOTES_TOKEN_ADDRESS).connect(this.provider);
    const tokenBalance = await this.tokenContract.balanceOf(accountAddr);
    console.log(`Account ${accountAddr} has a balance of ${tokenBalance} tokens\n`)
    return parseFloat(ethers.utils.formatEther(tokenBalance));
  }
}
