/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { BigNumber, ethers, Signer } from 'ethers';
import {
  isBalanceZero,
  getProvider,
  convertToBytes32Array,
} from './utils/util';
import { SmartHealth__factory } from 'typechain-types';

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
  isOwner: boolean;
}

export class authorizeDTO {}

interface Signers {
  patient: Signer;
  hcp: Signer;
}

@Injectable()
export class AppService {
  // Electronic Health Record (EHR) contract variables
  ehrContractFactory: ethers.ContractFactory;
  ehrContract: ethers.Contract;
  ehrContractOwnerAddress: string;
  signedInRole: string;
  signedInName: string;
  signers: Signers;

  constructor() {
    const BASE_STRING_PATH = "m/44'/60'/0'/0/";

    const provider = getProvider({
      ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    });

    // Initialise patient and hcp signers
    this.signers.patient = ethers.Wallet.fromMnemonic(
      process.env.MNEMONIC ?? '',
      BASE_STRING_PATH + '1',
    ).connect(provider);
    this.signers.hcp = ethers.Wallet.fromMnemonic(
      process.env.MNEMONIC ?? '',
      BASE_STRING_PATH + '2',
    ).connect(provider);
  }

  // End point for owner, hcp, unknown sign in screen (Raj)
  async initializeAccounts(address: string): Promise<rolePlayDTO> {
    const ownerAddress = await this.signers.patient.getAddress();
    const hcpAddress = await this.signers.hcp.getAddress();
    // Return role determined by address
    switch (address) {
      case ownerAddress:
        return {
          name: process.env.OWNER_NAME ?? 'Default Patient Name',
          role: 'owner',
          isOwner: true,
        };
      case hcpAddress:
        return {
          name: process.env.HCP_NAME ?? 'Default HCP Name',
          role: 'hcp',
          isOwner: false,
        };
      default:
        return { name: 'Unknown', role: 'Unknown', isOwner: false };
    }
  }

  // End point to create a new EHR contract with data from the create EHR screen (Ken)
  async deployContract(data: string[]) {
    let contract = null;
    if (await isBalanceZero(this.signers.patient)) {
      throw new Error('Not enough balance to deploy contract');
    }
    const contractFactory = new SmartHealth__factory(this.signers[1]);
    contract = await contractFactory.deploy(convertToBytes32Array(data));
    await contract.deployed();
    return { address: contract.address, hash: contract.txHash };
  }

  // Patient create EHR data first time, contract deployment  (Ken)
  async create(req: ehrDTO) {
    let contractAddress = null;
    let txHash = null;
    try {
      const data = [
        req.name,
        req.age.toString(),
        req.sex,
        req.weight.toString(),
        req.heartRate.toString(),
        req.bloodPressure,
        req.oxygenSaturation.toString(),
        req.temperature.toString(),
      ];
      await this.deployContract(data).then(({ address, hash }) => {
        contractAddress = address;
        txHash = hash;
      });
    } catch (error) {
      console.log(error);
    }
    return { contractAddress, txHash };
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
