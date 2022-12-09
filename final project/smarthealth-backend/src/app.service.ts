/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { BigNumber, ethers, Signer, Wallet } from 'ethers';
import {
  isBalanceZero,
  convertToBytes32Array,
  smartHealthContract,
  toStr,
  getPatient,
  getHCP,
} from './utils/util';
import { SmartHealth__factory } from 'typechain-types';
import { CreateEHRDto } from './dto/ehr.dto';
import { EHR } from './entities/ehr.entity';
import { HCP } from './entities/hcp.entity';
import { AuthorizeHCPDto } from './dto/hcp.dto';
require('dotenv').config();

export class rolePlayDTO {
  role: string;
  name: string;
  isOwner: boolean;
}

interface Wallets {
  patient: Wallet;
  hcp: Wallet;
}

@Injectable()
export class AppService {
  // Electronic Health RecoGrd (EHR) contract variables
  ehrContractFactory: ethers.ContractFactory;
  ehrContract: ethers.Contract;
  ehrContractOwnerAddress: string;
  signedInRole: string;
  signedInName: string;
  signers: Wallets = { patient: null, hcp: null };
  ownerAddress: string;
  hcpAddress: string;

  constructor() {
    // Initialise patient and hcp signers
    this.signers.patient = getPatient();
    this.signers.hcp = getHCP();
    this.ownerAddress = this.signers.patient.address;
    this.hcpAddress = this.signers.hcp.address;
  }

  async checkSignersAddress() {
    return {
      patient: await this.signers.patient.address,
      hcp: await this.signers.hcp.address,
    };
  }

  // End point for owner, hcp, unknown sign in screen (Raj)
  async getRole(address: string): Promise<rolePlayDTO> {
    // Return role determined by address
    switch (address) {
      case this.ownerAddress:
        return {
          name: process.env.OWNER_NAME ?? 'Default Patient Name',
          role: 'owner',
          isOwner: true,
        };
      case this.hcpAddress:
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
    const contractFactory = new SmartHealth__factory(this.signers.patient);
    contract = await contractFactory.deploy(convertToBytes32Array(data));
    await contract.deployed();
    return { address: contract.address, hash: contract.txHash };
  }

  // Patient create EHR data first time, contract deployment  (Ken)
  async create(req: CreateEHRDto): Promise<{
    contractAddress: string;
    data: EHR;
  }> {
    console.log(req);
    let contractAddress = null;
    try {
      const data = [
        req.name,
        req.age.toString(),
        req.sex,
        req.weight.toString(),
        //req.height.toString(),
        req.heartRate.toString(),
        req.bloodPressure,
        req.oxygenSaturation.toString(),
        req.temperature.toString(),
      ];
      await this.deployContract(data).then(({ address, hash }) => {
        contractAddress = address;
      });
    } catch (error) {
      console.log(error);
    }
    return { contractAddress, data: req };
  }

  // End point to authorize EHR metadata and details to HCP  (Ken)
  async authorize(
    req: AuthorizeHCPDto,
  ): Promise<{ txHash: string; data: HCP }> {
    let txHash: string;
    try {
    } catch (error) {
      console.error(error);
    }
    return { txHash, data: req };
  }

  // End point to view authorized EHR metadata and details  (Ken)
  async viewPatientSummary(address: string): Promise<{ result: any }> {
    let result = {};
    try {
      let signer = this.proxyAccount(address);
      await smartHealthContract()
        .connect(signer)
        .getPatientSummary()
        .then((summary) => {
          let { name, age, birthSex, weight } = summary;
          result = {
            name: toStr(name),
            age: toStr(age),
            birthSex: toStr(birthSex),
            weight: toStr(weight),
          };
        });
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  async viewPatientVitals(address: string): Promise<{ result: any }> {
    let result = {};
    try {
      let signer = this.proxyAccount(address);
      await smartHealthContract()
        .connect(signer)
        .getPatientVitals()
        .then((vitals) => {
          let { heartRate, bloodPressure, oxygenSat, temperature } = vitals;
          result = {
            heartRate: toStr(heartRate),
            bloodPressure: toStr(bloodPressure),
            oxygenSat: toStr(oxygenSat),
            temperature: toStr(temperature),
          };
        });
    } catch (error) {
      console.log(error);
    }
    return { result };
  }

  // Function as an account selector, this SHOULD NOT be used in production. The front end should determine and
  // redirect patient/hcp API to call the right endpoint instead. This will eventually be deprecated
  proxyAccount = (address: string): Wallet => {
    switch (address) {
      case this.ownerAddress:
        return this.signers.patient;
      case this.hcpAddress:
        return this.signers.hcp;
      default:
        throw new Error('Account does not exist');
    }
  };
}
