import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BigNumber, Signer, ethers } from 'ethers';
import lotteryJson from '../assets/Lottery.json';
import { MenuItem } from './menuItem';
import { MENUITEMS } from './menu-items';
import { environment } from 'src/environments/environment';
import tokenJson  from '../assets/LotteryToken.json';

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
  connectedAccount: ethers.Wallet | undefined;
  signer: ethers.Signer | undefined;
  etherBalance: string | undefined;
  lotteryContract: ethers.Contract | undefined;
  tokenContract?: ethers.Contract ;
  currentBlock: any;

  // Set this address to the address of the deployed contract
  lotteryContractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

  // Initialize the accounts array
  signers: Signer[] = new Array(7);
  mnemonic = environment.LOCAL_MNEMONIC;

  lotteryState: string | undefined; // whether lottery is open or closed
  menuSelected?: number = 0; // For menu options
  lastBlockMinedDtTm?: string;
  lotterCloseTm?: string;
  txSuccess?: boolean;

  prizeAmount: string | undefined;
  currentAddress: string | undefined;
  transactionHash: string | undefined;

  // checkStateSelected: boolean = false; // Toggle Details panel display on html
  // openBetsSelected: boolean = false;

  constructor(private http: HttpClient) {
    console.log('AppComponent constructor');
  }

  // For later iterations using lifecycle hooks
  ngOnInit(): void {}

  // For later iterations using observables
  onSelect(menuItem: MenuItem): void {
    this.selectedMenuItem = menuItem;
  }

  async initAccounts(provider: ethers.providers.Web3Provider) {
    // Preserve the immutability of the Signers; ensure proper initialization while cycling through the accounts
    const basepathstr = "m/44'/60'/0'/0/";

    // Cycle through the accounts and initialize the signers
    for (let index = 0; index < 7; index++) {
      this.signers[index] = ethers.Wallet.fromMnemonic(
        environment.LOCAL_MNEMONIC ?? '',
        basepathstr + index.toString()
      ).connect(provider);
      console.log(
        `Account${index}: ${await this.signers[
          index
        ].getAddress()}  Balance: ${await this.signers[index].getBalance()} wei`
      );
    }
  } // end initAccounts

  // Connect to MetaMask
  async connectWallet() {
    console.log('connectWallet');
    // Connect to a provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    if (window.ethereum) {
      try {
        // Initialize accounts
        this.initAccounts(this.provider);

        // Get the account address
        this.connectedAccount = await this.provider.send(
          'eth_requestAccounts',
          []
        );
        console.log('account', this.connectedAccount);

        // Get the first signer and address
        this.signer = this.provider.getSigner(0);
        console.log('signer:', this.signer.getAddress());

        // Get the ether balance
        this.etherBalance = ethers.utils.formatEther(
          await this.signer.getBalance()
        );
        console.log('etherBalance', this.etherBalance.toString());

        // Connect to the deployed lottery contract
        this.lotteryContract = new ethers.Contract(
          this.lotteryContractAddress,
          lotteryJson.abi,
          this.signer
        );
        console.log('lotteryContract', this.lotteryContract);
        console.log('latest block', await this.provider.getBlockNumber());

        // Connect to the deployed lottery contract
        this.tokenContract = new ethers.Contract(
          this.lotteryContractAddress,
          tokenJson.abi,
          this.signer
        );

        this.menuSelected = -1; // Hide the sign-in button

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
    // this.checkStateSelected = true;
    this.menuSelected = 1;
    const state = await this.lotteryContract?.['betsOpen']();
    this.lotteryState = state ? 'open' : 'closed';
    console.log(`The lottery is ${this.lotteryState}\n`);
    if (!state) return;
    this.currentBlock = await this.provider?.getBlock('latest');
    const currentBlockDate = new Date(this.currentBlock?.timestamp * 1000);
    const closingTime = await this.lotteryContract?.['betsClosingTime']();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    this.lastBlockMinedDtTm =
      currentBlockDate.toLocaleString() +
      ':' +
      currentBlockDate.toLocaleTimeString();
    this.lotterCloseTm =
      closingTimeDate.toLocaleString() +
      ':' +
      closingTimeDate.toLocaleTimeString();
    console.log(
      `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n`
    );
    console.log(
      `lottery should close at  ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
    );
    // this.checkStateSelected = false;
  }

 // Simple listener to callback openBets
  onOpenBets(menuSelected: number) {
    this.menuSelected = menuSelected;
  }

  // Reuse from the class except we are implementing this in the frontend
  async openBets(duration: string) {
    try {
      this.menuSelected = 2;
      console.log('duration', duration, 'Number', Number(duration));
      if (this.menuSelected == 2 && (this.lotteryState=='closed')) {
      // We are opening the bets
      // this.openBetsSelected = true;
      this.currentBlock = await this.provider?.getBlock('latest');
      const tx = await this.lotteryContract?.['openBets'](
        this.currentBlock.timestamp + Number(duration)
      );
      const receipt = await tx.wait();
      console.log(`Bets opened (${receipt.transactionHash})`);
    } else {
      console.log(`Bets are already open`);
    }
    } catch (error) {
      console.log(error);
    }
  }
  // Simple listener to callback buyTokens
  onBuyTokens(menuSelected: number) {
    this.menuSelected = menuSelected;
  }

  async buyTokens(index: string, amount: string) {
    this.menuSelected = 3;
    const TOKEN_RATIO = 1;
    try {
      console.log(
        `Buying ${amount} tokens for account ${await this.signers[
          Number(index)
        ].getAddress()}`
      );
      const tx = await this.lotteryContract
        ?.connect(this.signers[Number(index)])
        ['purchaseTokens']({
          value: ethers.utils.parseEther(amount).div(TOKEN_RATIO),
        });
      const receipt = await tx.wait();
      console.log(`Tokens bought (${receipt.transactionHash})\n`);

      this.txSuccess = true;
    } catch (error) {
      console.log(error);
    }
  }
  async checkPrize(address: string) {
    const prizeAmt = await this.lotteryContract?.['checkPrize'](address);
    console.log(`Account ${address} has ${prizeAmt}\n`);
    this.currentAddress = address;
    this.prizeAmount = prizeAmt;

  }

  async withdraw(index: string, amount: string){
    this.transactionHash = '';
    const tx = await this.lotteryContract?.connect(this.signers[Number(index)])['withdraw'](amount);
    const receipt = await tx.wait();
    console.log(`Withdrew winnings (${receipt.transactionHash})\n`);
    this.transactionHash = receipt.transactionHash;
    console.log('withdrawing tokens');
  }

  async burnTokens(index: string, amount: string){
      this.transactionHash = '';
      const tx = await this.lotteryContract?.connect(this.signers[Number(index)])['returnTokens'](amount);
      const receipt = await tx.wait();
      console.log(`Burned tokens (${receipt.transactionHash})\n`);
      console.log('returning tokens');
      this.transactionHash = receipt.transactionHash;
  }

  async bet(index: string, amount: string) {
    const allowTx = await this.lotteryContract?.connect(this.signers[Number(index)])['approve'](this.lotteryContract?.address, ethers.constants.MaxUint256);
    await allowTx.wait();
    const tx = await this.lotteryContract?.connect(this.signers[Number(index)])['betMany'](amount);
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
  }

  todo(menuSelected: number) {
    this.menuSelected = menuSelected;
    console.log(`todo ${menuSelected}`);
  }
}
