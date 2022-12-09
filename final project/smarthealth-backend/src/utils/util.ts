import { ethers } from 'ethers';

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

export const getProvider = ({ ALCHEMY_API_KEY }) => {
  return ethers.getDefaultProvider('goerli', {
    alchemy: ALCHEMY_API_KEY ?? '',
    //etherscan: ETHERSCAN_API_KEY ?? '',
  });
};
