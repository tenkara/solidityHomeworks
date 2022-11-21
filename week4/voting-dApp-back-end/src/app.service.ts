import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { BigNumber, ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
// import * as dotenv from "dotenv";

export class mintedTokens {
  mintToAddress: Address;
  tokenAmnt: string;
}

export class delegatedTokens {
  delegatee: Address;
}

const ER20VOTES_TOKEN_ADDRESS = "0x007d4680437174cca622c3ae230df5b7a0a31779";

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

  constructor() {
    // Set up a provider
    this.provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY ?? "");
    // const network = await this.provider.getNetwork();

    // Connect Wallet to the provider
    // console.log("connecting to a wallet...\n");
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
    // const signer = wallet.connect(this.provider);
    
    //const balance = await signer.getBalance();
    // console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
    // if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");
    
    // Attach to MyToken smart contract facotry with the signer
    this.tokenContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    );
    
    // Token contract instance
    this.tokenContract = this.tokenContractFactory
    .attach(ER20VOTES_TOKEN_ADDRESS)
    .connect(this.provider);
    
    // const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
    // ...
  }  
  
  getTokenAddress() {
    return ER20VOTES_TOKEN_ADDRESS;
  }

  async requestTokens(toAddress: Address, amount: string) {
    
    // Connect Wallet to the provider as minter
    console.log("connecting to a wallet...\n");
    const signerWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC_ACCT1);
    const signer = signerWallet.connect(this.provider);

    // Signer to send the transaction
    console.log("attach signer");
    const contractInstance = this.tokenContractFactory
      .attach(ER20VOTES_TOKEN_ADDRESS)
      .connect(signer);
    
    // Mint some tokens that matter - let's have a party!!!
    // const mintValue = (ethers.utils.parseEther(amount)).mul(oneEther);
    const mintValue = ethers.utils.parseEther(amount);
    
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
    return parseFloat(ethers.utils.formatEther(votes));
  }

  async tokenBalance(accountAddr: string): Promise<number> {
    console.log(`Checking token balance for address: ${accountAddr}\n`);
    // const contractInstance = this.tokenContractFactory.attach(ER20VOTES_TOKEN_ADDRESS).connect(this.provider);
    const tokenBalance = await this.tokenContract.balanceOf(accountAddr);
    console.log(`Account ${accountAddr} has a balance of ${tokenBalance} tokens\n`)
    return parseFloat(ethers.utils.formatEther(tokenBalance));
  }
}
