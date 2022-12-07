import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { BigNumber, ethers } from 'ethers';

// import * as dotenv from "dotenv";


@Injectable()
export class AppService {
  provider: ethers.providers.AlchemyProvider;

  // Electronic Health Record (EHR) contract variables
  ehrContractFactory: ethers.ContractFactory;
  ehrContract: ethers.Contract;
  ehrContractOwnerAddress: string;

  constructor() {

  }

  // End point for owner sign in screen (Raj)
  getEhrContractAddress() {  // getter
    return this.ehrContract.address;
  }

  // End point for HCP sign up screen (Raj)


  // End point to create a new EHR contract with data from the create EHR screen (Ken)
  deployEHRContract(...args: any[]) {
    let ehrContractAddress: string;
    // Each patient owns and manages their own EHR contract to stay in compliance with HIPAA
    try { } catch (error) { }
    return { ehrContractAddress };
  }

  // End point to authorize EHR metadata and details to HCP  (Ken)
  authorizeEHRDatatoHCP(...args: any[]) {
    let TxHash: string;
    try { } catch (error) { }
    return { TxHash };
  }

  // End point to view authorized EHR metadata and details  (Ken)
  async getAuthorizedData(...args: any[]) {
    let authorizedData: any;
    try {

    } catch (error) {
      console.log(error);
    }

    return { authorizedData };
  }

  
}
