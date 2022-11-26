import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ethers } from 'ethers';


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

  constructor(private http: HttpClient) {
    console.log('AppComponent constructor');
  }

  async connectWallet() {
    console.log('connectWallet');
    // Connect to a provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    if (window.ethereum) {
      try {
        // Request account access if needed
        this.account = await this.provider.send('eth_requestAccounts', []);
        console.log('account', this.account);
        this.signer = await this.provider.getSigner();
        console.log('signer', this.signer);
      } catch (error) {
        console.log('User denied account access');
      }
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }
}
