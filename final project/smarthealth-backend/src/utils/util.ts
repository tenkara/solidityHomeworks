import { ethers } from 'ethers';
import * as SmartHealth from '../assets/SmartHealth.json';

const BASE_STRING_PATH = "m/44'/60'/0'/0/";

export const convertToBytes32Array = (array: string[]) => {
  const bytes32Array = array.map((x: string) =>
    ethers.utils.formatBytes32String(x),
  );
  return bytes32Array;
};

export const isBalanceZero = async (signer: any) => {
  const balance = await signer.getBalance();
  return balance === 0 ? true : false;
};

export const getProvider = () => {
  return new ethers.providers.AlchemyProvider(
    'goerli',
    process.env.ALCHEMY_API_KEY ?? '',
  );
};

export const smartHealthContract = () => {
  return new ethers.ContractFactory(
    SmartHealth.abi,
    SmartHealth.bytecode,
  ).attach(process.env.PATIENT_CONTRACT_ADDRESS ?? '');
};

export const toStr = (str) => {
  return ethers.utils.parseBytes32String(str);
};

// Initialise patient
export const getPatient = () =>
  ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC ?? '',
    BASE_STRING_PATH + '0',
  ).connect(getProvider());

// Initialise HCP
export const getHCP = () =>
  ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC ?? '',
    BASE_STRING_PATH + '1',
  ).connect(getProvider());