import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BigNumber, ethers } from 'ethers';
import lotteryJson from  '../assets/Lottery.json';
import { MenuItem } from './menuItem';
import { MENUITEMS } from './menu-items';
//import * as tokenJson  from '../assets/LotteryToken.json';

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // title = 'lottery-frontend';

  // For later iterationa; For first iteration keep it simple
  menuItems = MENUITEMS;
  selectedMenuItem?: MenuItem;

  // Instance variables for the lottery contract
  provider: ethers.providers.Web3Provider | undefined;
  account: ethers.Wallet | undefined;
  signer: ethers.Signer | undefined;
  etherBalance: string | undefined;
  lotteryContract: ethers.Contract | undefined;
  currentBlock: any;

  // Set this address to the address of the deployed contract
  lotteryContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  lotteryState: string | undefined; // whether lottery is open or closed
  menuSelected: number | undefined; // Toggle Details panel display on html


  constructor(private http: HttpClient) {
    console.log('AppComponent constructor');
  }

  // For later iterations using lifecycle hooks
  ngOnInit(): void {
  }

  // For later iterations using observables
  onSelect(menuItem: MenuItem): void {
    this.selectedMenuItem = menuItem;
    }

  // Connect to MetaMask
  async connectWallet() {
    console.log('connectWallet');
    // Connect to a provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    if (window.ethereum) {
      try {
        // Get the account address
        this.account = await this.provider.send('eth_requestAccounts', []);
        console.log('account', this.account);

        // Get the first signer and address
        this.signer = this.provider.getSigner(0);
        console.log('signer:', this.signer.getAddress());

        // Get the ether balance
        this.etherBalance = ethers.utils.formatEther(await this.signer.getBalance()) ;
        console.log('etherBalance', this.etherBalance.toString());

        // Connect to the deployed lottery contract
        this.lotteryContract = new ethers.Contract(this.lotteryContractAddress, lotteryJson.abi, this.signer);
        console.log('lotteryContract', this.lotteryContract);
        console.log('latest block', await this.provider.getBlockNumber());
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }

  // Reuse from the class except we are implementing this in the frontend
  async checkState() {
    this.menuSelected = 1;
    const state = await this.lotteryContract?.['betsOpen']();
    this.lotteryState = state ? 'open' : 'closed';
    console.log(`The lottery is ${this.lotteryState}\n`);
    if (!state) return;
    this.currentBlock = await this.provider?.getBlock("latest");
    const currentBlockDate = new Date(this.currentBlock?.timestamp * 1000);
    const closingTime = await this.lotteryContract?.['betsClosingTime']();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    console.log(
      `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n`
    );
    console.log(
      `lottery should close at  ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
    );
  }

  // Reuse from the class except we are implementing this in the frontend
  // To be Continued
  async openBets(duration: string) {
    // this.latestBlock = await this.provider?.getBlock('latest');
    // console.log('latest block', this.latestBlock);
     this.currentBlock = await this.provider?.getBlock("latest");
     const tx = await this.lotteryContract?.['openBets'](this.currentBlock.timestamp + Number(duration));
  //   const receipt = await tx.wait();
  //   console.log(`Bets opened (${receipt.transactionHash})`);
  }

  prizeMenu(){
    this.menuSelected = 3;
  }

  async checkPrize(address: string) {
    const prizeAmount = await this.lotteryContract?.['checkPrize'](address);
    console.log(`Account ${address} has ${prizeAmount}\n`);

  }

}
