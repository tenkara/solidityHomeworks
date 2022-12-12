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
  provider: ethers.providers.AlchemyProvider;

  // Electronic Health Record (EHR) contract variables
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
  // constructor() {}

  // End point for owner, hcp, unknown sign in screen (Raj)
  // Uses the BIP 44 standard for HD wallet derivation path to set up the accounts and their roles for the first iteration
  async initializeAccounts(address: string) {
    // log the input address
    console.log(`Address: ${address}`);
    // set up a Provider
    const provider = new ethers.providers.AlchemyProvider(
      'goerli',
      process.env.ALCHEMY_API_KEY ?? '',
    );
    const network = await provider.getNetwork(); // For later iterations

    // Preserve the immutability of the Signers; ensure proper initialization while cycling through the accounts
    const basepathstr = "m/44'/60'/0'/0/";
    const signer: Signer[] = new Array(2); // For now we just use 2 accounts, owner and HCP

    // Cycle through the accounts and initialize the signers
    for (let index = 0; index < 2; index++) {
      signer[index] = ethers.Wallet.fromMnemonic(
        process.env.MNEMONIC ?? '',
        basepathstr + index.toString(),
      ).connect(provider);
      console.log(
        `Account${index}: ${await signer[
          index
        ].getAddress()}  Balance: ${await signer[index].getBalance()} wei`,
      );
    }

    // Determine the account and associatee the roles with the accounts
    // This enables role play of contract owner and HCP and to demonstrate the interaction between the two and the EHR contract
    const ownerAddress = await signer[0].getAddress(); // Owner account for the first itereation
    const hcpAddress = await signer[1].getAddress(); // HCP account for the first iteration

    if (ownerAddress === address) {
      this.signedInRole = 'owner';
    } else if (hcpAddress === address) {
      this.signedInRole = 'hcp';
    } else {
      this.signedInRole = 'unknown';
    }

    if (this.signedInRole === 'owner') {
      this.signedInName = process.env.OWNER_NAME ?? '';
    } else if (this.signedInRole === 'hcp') {
      this.signedInName = process.env.HCP_NAME ?? '';
    } else {
      this.signedInName = 'unknown';
    }

    return { result: this.signedInRole };
    // return { rolePlayDTO: { role: this.signedInRole, name: this.signedInName } }; // For subsequent iterations
  }

  async checkSignersAddress() {
    return {
      patient: await this.signers.patient.address,
      hcp: await this.signers.hcp.address,
    };
  }

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

  // End point to create EHR metadata (Ken)
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
        req.height.toString(),
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
    return await smartHealthContract()
      .connect(this.signers.patient)
      .authorizeProvider(
        ethers.utils.formatBytes32String(req.name),
        ethers.utils.formatBytes32String(req.auth),
        ethers.utils.formatBytes32String(req.reason),
        this.signers.hcp.address,
      )
      .then(
        ({ transactionHash }) => {
          return {
            txHash: transactionHash,
            data: req,
          };
        },
        (error) => {
          console.log('Authorize error :', error);
        },
      );
  }

  async viewHCPDetails(): Promise<{ result: any }> {
    return await smartHealthContract()
      .connect(this.signers.hcp)
      .getHCPDetails(this.signers.hcp.address)
      .then(
        (details) => {
          return {
            hcpName: toStr(details.hcpName),
            infoToAuth: toStr(details.infoToAuth),
            reason: toStr(details.reason),
          };
        },
        (error) => {
          console.log('View HCP Details error :', error);
        },
      );
  }

  // End point to view authorized EHR metadata and details  (Ken)
  async viewPatientSummary(address: string): Promise<{ result: any }> {
    const signer = this.proxyAccount(address);
    if (signer === this.signers.patient) {
      return await smartHealthContract()
        .connect(signer)
        .getPatientSummary()
        .then(
          ({ name, age, birthSex, weight, height }) => {
            return {
              name: toStr(name),
              age: toStr(age),
              birthSex: toStr(birthSex),
              weight: toStr(weight),
              height: toStr(height),
            };
          },
          (error) => {
            console.log('View patient summary :', error);
          },
        );
    } else {
      return await smartHealthContract()
        .connect(signer)
        .getPatientSummaryHCP(this.signers.hcp.address)
        .then(
          ({ name, age, birthSex, weight, height }) => {
            return {
              name: toStr(name),
              age: toStr(age),
              birthSex: toStr(birthSex),
              weight: toStr(weight),
              height: toStr(height),
            };
          },
          (error) => {
            console.log('View patient summary as HCP error :', error);
          },
        );
    }
  }

  async viewPatientVitals(address: string): Promise<{ result: any }> {
    const signer = this.proxyAccount(address);
    if (signer == this.signers.patient) {
      return await smartHealthContract()
        .connect(signer)
        .getPatientVitals()
        .then(
          ({ heartRate, bloodPressure, oxygenSat, temperature }) => {
            return {
              heartRate: toStr(heartRate),
              bloodPressure: toStr(bloodPressure),
              oxygenSat: toStr(oxygenSat),
              temperature: toStr(temperature),
            };
          },

          (error) => {
            console.log('View patient vitals error :', error);
          },
        );
    } else {
      return await smartHealthContract()
        .connect(signer)
        .getPatientVitalsHCP(this.signers.hcp.address)
        .then(
          ({ heartRate, bloodPressure, oxygenSat, temperature }) => {
            return {
              heartRate: toStr(heartRate),
              bloodPressure: toStr(bloodPressure),
              oxygenSat: toStr(oxygenSat),
              temperature: toStr(temperature),
            };
          },
          (error) => {
            console.log('View patient vitals as HCP error :', error);
          },
        );
    }
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
