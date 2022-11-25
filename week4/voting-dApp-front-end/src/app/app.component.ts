import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';
import ballotJson from '../assets/TokenizedBallot.json';
import { MetaMaskInpageProvider } from '@metamask/providers/dist/MetaMaskInpageProvider';
import { parseBytes32String } from 'ethers/lib/utils';

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
    // ethereum?: Window;
  }
}
// declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.Web3Provider | undefined;
  // provider: ethers.providers.BaseProvider | undefined;
  signer: ethers.Signer | undefined;
  account: ethers.Wallet | undefined;

  tokenContractAddress: string | undefined;
  ballotContractAddress: string | undefined;

  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;
  winnerName: string | undefined;

  tokenContract: ethers.Contract | undefined;
  ballotContract: ethers.Contract | undefined;

  // Almost a crime to do this below instead of injecting through config service
  constructor(private http: HttpClient) {}

  async connectWallet() {
    // Connect to the provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    if (window.ethereum) {
      // Get the account to use for interaction with Token and Ballot contracts
      this.account = await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();
      console.log(`account: ${this.account}\n`);
      console.log(`account: ${await this.signer.getAddress()}\n`);

      this.http
        .get<any>('http://localhost:3000/token-address')
        .subscribe((ans) => {
          this.tokenContractAddress = ans.result;
          console.log(`tokenContractAddress: ${this.tokenContractAddress}`);
          if (this.tokenContractAddress && this.account) {
            this.tokenContract = new ethers.Contract(
              this.tokenContractAddress,
              tokenJson.abi,
              this.signer
            );
            this.signer?.getBalance().then((balanceBN) => {
              this.etherBalance = parseFloat(
                ethers.utils.formatEther(balanceBN)
              );
              console.log(`ether balance: ${this.etherBalance}`);
            });
            this.tokenContract['balanceOf'](this.signer?.getAddress()).then(
              (tokenBalanceBn: BigNumber) => {
                this.tokenBalance = parseFloat(
                  ethers.utils.formatEther(tokenBalanceBn)
                );
                console.log(`Token Balance : ${this.tokenBalance}`);
              }
            );
          }
        });
      this.http
        .get<any>('http://localhost:3000/ballot-address')
        .subscribe((ans) => {
          this.ballotContractAddress = ans.result;
          console.log(`ballotContractAddress: ${this.ballotContractAddress}`);
          if (this.ballotContractAddress && this.account) {
            this.ballotContract = new ethers.Contract(
              this.ballotContractAddress,
              ballotJson.abi,
              this.signer
            );
            this.ballotContract['votingPower'](this.signer?.getAddress()).then(
              (votePowerBn: BigNumber) => {
                this.votePower = parseFloat(
                  ethers.utils.formatEther(votePowerBn)
                );
                console.log(`Vote Power: ${this.votePower}`);
              }
            );
          }
        });
    } else {
      console.log(`Unable to connect to a wallet`);
    }
  }

  createWallet() {
    // this.provider = ethers.providers.getDefaultProvider('goerli');
    // this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    // this.http
    //   .get<any>('http://localhost:3000/token-address')
    //   .subscribe((ans) => {
    //     this.tokenContractAddress = ans.result;
    //     if (this.tokenContractAddress && this.wallet) {
    //       this.tokenContract = new ethers.Contract(
    //         this.tokenContractAddress,
    //         tokenJson.abi,
    //         this.wallet
    //       );
    //       this.wallet.getBalance().then((balanceBN) => {
    //         this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
    //       });
    //       this.tokenContract['balanceOf'](this.wallet.address).then(
    //         (tokenBalanceBn: BigNumber) => {
    //           this.tokenBalance = parseFloat(
    //             ethers.utils.formatEther(tokenBalanceBn)
    //           );
    //         }
    //       );
    //       this.tokenContract['getVotes'](this.wallet.address).then(
    //         (votePowerBn: BigNumber) => {
    //           this.votePower = parseFloat(
    //             ethers.utils.formatEther(votePowerBn)
    //           );
    //         }
    //       );
    //       this.http
    //         .get<any>('http://localhost:3000/ballot-address')
    //         .subscribe((ans) => {
    //           this.ballotContractAddress = ans.result;
    //         });
    //     }
    //   });
  }

  async vote(voteId: string) {
    console.log('Voting in progress for account: ' + voteId);
    // Todo for homework
    // this.ballotContract["vote"](voteId);
    // this.http
    //   .get<any>('http://localhost:3000/ballot-address')
    //   .subscribe((ans) => {
    //     this.ballotContractAddress = ans.result;

    //     if (this.ballotContractAddress && this.account) {
    // console.log('Creating Ballot contract instance');
    // this.ballotContract = new ethers.Contract(
    //   this.ballotContractAddress,
    //   ballotJson.abi,
    //   this.signer
    // );
    console.log('Post request to cast vote in progress...');
    this.http
      .post<any>('http://localhost:3000/cast-vote', {
        voterAddress: await this.signer?.getAddress(),
        proposal: voteId,
        tokenAmount: 1,
      })
      .subscribe((ans) => {
        console.log(ans.result);
      });
  }

  winner() {
    this.http
      .get<any>('http://localhost:3000/winning-proposal')
      .subscribe((ans) => {
        console.log(ans);
        this.winnerName = ans.result;
      });
  }

  async request(tokenAmount: string) {
    console.log(`mintToAddress ${await this.signer?.getAddress()}`);
    this.http
      .post<any>('http://localhost:3000/request-tokens', {
        // mintToAddress: this.signer?.getAddress(),
        // tokenAmnt: 'tokenAmount',
        mintToAddress: await this.signer?.getAddress(),
        tokenAmnt: tokenAmount,
      })
      .subscribe((ans) => {
        console.log(ans);
      });
  }
}
