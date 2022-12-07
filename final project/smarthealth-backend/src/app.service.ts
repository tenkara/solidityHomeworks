import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { BigNumber, ethers } from 'ethers';

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

export class authorizeDTO {}

@Injectable()
export class AppService {
  provider: ethers.providers.AlchemyProvider;

  // Electronic Health Record (EHR) contract variables
  ehrContractFactory: ethers.ContractFactory;
  ehrContract: ethers.Contract;
  ehrContractOwnerAddress: string;

  constructor() {}

  // End point for owner sign in screen (Raj)
  getEhrContractAddress() {
    // getter
    return this.ehrContract.address;
  }

  // End point for HCP sign up screen (Raj)

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
    let authorizedData: ehrDTO = {
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
