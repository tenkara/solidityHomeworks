/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { BigNumber, ethers, Signer } from 'ethers';

// import * as dotenv from "dotenv";

export class ehrDTO {
  name: string;
  age: number;
  sex: string;
  height: number;
  weight: number;
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  temperature: number;
}

export class rolePlayDTO {
  role: string;
  name: string;
}

export class authorizeDTO {

}

@Injectable()
export class AppService {
  provider: ethers.providers.AlchemyProvider;

  // Electronic Health Record (EHR) contract variables
  ehrContractFactory: ethers.ContractFactory;
  ehrContract: ethers.Contract;
  ehrContractOwnerAddress: string;
  signedInRole: string;
  signedInName: string;

  constructor() {}

  // End point for owner, hcp, unknown sign in screen (Raj)
  // Uses the BIP 44 standard for HD wallet derivation path to set up the accounts and their roles for the first iteration
  async initializeAccounts(address: string) {
  
    // log the input address
    console.log(`Address: ${address}`);
    // set up a Provider
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY ?? "");
    const network = await provider.getNetwork(); // For later iterations
      
   // Preserve the immutability of the Signers; ensure proper initialization while cycling through the accounts
       const basepathstr = "m/44'/60'/0'/0/";
       const signer: Signer[] = new Array(2); // For now we just use 2 accounts, owner and HCP
   
   // Cycle through the accounts and initialize the signers
       for( let index = 0; index < 2; index++ ) {
           signer[index] = (ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", basepathstr+index.toString())).connect(provider);
           console.log(`Account${index}: ${await (signer[index]).getAddress()}  Balance: ${await (signer[index]).getBalance()} wei`); 
       }

    // Determine the account and associatee the roles with the accounts
    // This enables role play of contract owner and HCP and to demonstrate the interaction between the two and the EHR contract
    const ownerAddress = await signer[0].getAddress(); // Owner account for the first itereation
    const hcpAddress = await signer[1].getAddress(); // HCP account for the first iteration

    if (ownerAddress === address) {
      this.signedInRole = "owner";
    } else if (hcpAddress === address) {
      this.signedInRole = "hcp";
    } else {
      this.signedInRole = "unknown";  
    }
    
    if (this.signedInRole === "owner") {
      this.signedInName = process.env.OWNER_NAME ?? "";
    } else if (this.signedInRole === "hcp") {
      this.signedInName = process.env.HCP_NAME ?? "";
    } else {
      this.signedInName = "unknown";
    }

    return { result: this.signedInRole };
    // return { rolePlayDTO: { role: this.signedInRole, name: this.signedInName } }; // For subsequent iterations
  }


  // End point to create a new EHR contract with data from the create EHR screen (Ken)
  deployEHRContract(...args: any[]) {
    let ehrContractAddress: string;
    // Each patient owns and manages their own EHR contract to stay in compliance with HIPAA
    try {
    } catch (error) {}
    return { ehrContractAddress };
  }

  // End point to create EHR metadata (Ken)
  async create(req: ehrDTO) {
    let txHash: string;
    try {
    } catch (error) {}
    return { txHash };
  }

  // End point to authorize EHR metadata and details to HCP  (Ken)
  async authorize(req: authorizeDTO) {
    let txHash: string;
    try {
    } catch (error) {}
    return { txHash };
  }

  // End point to view authorized EHR metadata and details  (Ken)
  async view() {
    const authorizedData: ehrDTO = {
      name: 'Joe Smith',
      age: 25,
      sex: 'Male',
      height: 70,
      weight: 150,
      heartRate: 75,
      bloodPressure: '120/80',
      oxygenSaturation: 98,
      temperature: 99.5,
    };
    try {
    } catch (error) {
      console.log(error);
    }
    return { authorizedData };
  }
}
