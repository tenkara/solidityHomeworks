import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();
//contract address = 0xB58751975a5Fb1F0f112bC29a2260E03697d0681

async function main() {
    const contractAddress = process.argv[2];
    const targetAddress = process.argv[3];
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC_ACCT1 ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);

    const ballotContractFactory = new Ballot__factory(signer);
    const ballotContract = ballotContractFactory.attach(
      contractAddress
    );
    const tx = await ballotContract.delegate(targetAddress);
    await tx.wait();
    console.log("Done!");
    console.log(tx.hash);
  }

  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });