import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
// import * as dotenv from "dotenv";

export class mintedTokens {
  mintToAddress: Address;
  tokenAmnt: number;
}

const ER20VOTES_TOKEN_ADDRESS = "0xdC0FF2Ce170c2E1c130960c7E64A2b18eAD3266F";

// Read the environment into this script
// pre-req: install dotenv using yarn add dotenv --dev
// pre-req: add .env file into the project-name directory
// pre-req: ensure .env is ignored in .gitignore to avoid uploading to github
// dotenv.config();

@Injectable()
export class AppService {

  provider: ethers.providers.AlchemyProvider;
  tokenContract: ethers.Contract;

  constructor() {
    // Set up a provider
    this.provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY ?? "");
    // const network = await this.provider.getNetwork();

    // Connect Wallet to the provider
    console.log("connecting to a wallet...\n");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_1 ?? "");
    const signer = wallet.connect(this.provider);
    
    //const balance = await signer.getBalance();
    // console.log(`Connected to the provider ${network.name} with wallet ${signer.address} and a balance of ${balance}\n`);
    // if(balance.eq(0)) throw new Error("Cannot buy tokens with zero balance in the account\n");
    
    // Attach to MyToken smart contract facotry with the signer
    const tokenContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
      signer
    );
    this.tokenContract = tokenContractFactory.attach(ER20VOTES_TOKEN_ADDRESS);
    // const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
    // ...
  }  
  
  getTokenAddress() {
    return ER20VOTES_TOKEN_ADDRESS;
  }

  async requestTokens(toAddress: Address, amount: number) {
    
    // Mint some tokens
    const mintTx = await this.tokenContract.mint(toAddress, amount);
    await mintTx.wait()
    console.log(`Minted ${amount} of Tokens to account ${toAddress}\n`);
    console.log(`Transaction hash is ${mintTx.hash}\n`)
    const TxHash: string = mintTx.hash;
    return TxHash;
  }
}
