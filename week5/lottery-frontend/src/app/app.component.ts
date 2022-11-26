import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BigNumber, ethers } from 'ethers';
//import * as lotteryJson from '../assets/Lottery.json';
//import * as tokenJson  from '../assets/LotteryToken.json';


declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'lottery-frontend';
  provider: ethers.providers.Web3Provider | undefined;
  account: ethers.Wallet | undefined;
  signer: ethers.Signer | undefined;
  etherBalance: string | undefined;
  lotteryContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  lotteryContract: ethers.Contract | undefined;

  constructor(private http: HttpClient) {
    console.log('AppComponent constructor');
  }

  async connectWallet() {
    console.log('connectWallet');
    // Connect to a provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    if (window.ethereum) {
      try {
        // Get the account address
        this.account = await this.provider.send('eth_requestAccounts', []);
        // const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.log('account', account);
        console.log('account', this.account);
        this.signer = this.provider.getSigner(0);
        console.log('signer', await this.signer.getAddress());
        this.etherBalance = ethers.utils.formatEther(await this.signer.getBalance()) ;
        console.log('etherBalance', this.etherBalance.toString());
        // this.lotteryContract = new ethers.Contract(this.lotteryContractAddress, lotteryJson.abi, this.signer);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }
}
