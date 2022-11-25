import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers' ;
import tokenJson from '../assets/MyToken.json';
import ballotJson from  '../assets/TokenizedBallot.json';

//this is my token contract so I have minting power
const ERC20VOTES_TOKEN_ADDRESS = '0x007d4680437174ccA622C3Ae230Df5b7A0a31779';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  wallet: ethers.Wallet | undefined;
  walletAddress: string | undefined;
  provider: ethers.providers.BaseProvider | undefined;

  tokenContractAddress: string | undefined;
  ballotContractAddress = '0xa4B13aEe3Be9f95d50E043596b55C6d817aD3f20';

  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;
  tokenContract: ethers.Contract | undefined;
  ballotContract: ethers.Contract | undefined;
  ballotResults: string | undefined;
  web3: any;


  //to do 
  //should create a service to do the http stuff, 
  //but it is in here to save time
  constructor(private http: HttpClient) {
    
  }

  connectWallet(walletAddr: string){
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.walletAddress = walletAddr;
    this.createWallet();
    
  }

  async connectMetaMask(){
    console.log("trying to connect");
    const provider2 = new ethers.providers.Web3Provider(this.web3.currentProvider);
    // Prompt user for account connections
    await provider2.send("eth_requestAccounts", []);
    const signer = provider2.getSigner();
    console.log("Account:", await signer.getAddress());


  }  

  createWallet() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.http
    .get<any>("http://localhost:3000/token-address")
    .subscribe((ans) => {
      this.tokenContractAddress = ans.result;
      this.updateBlockchainInfo();
      setInterval(this.updateBlockchainInfo, 1000);
    });
  }

  private updateBlockchainInfo() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    if (this.tokenContractAddress && this.walletAddress) {
      this.tokenContract = new ethers.Contract(
        this.tokenContractAddress,
        tokenJson.abi,
        this.wallet
      );

      this.provider.getBalance(this.walletAddress).then((balanceBn) => {
        this.etherBalance = parseFloat(
          ethers.utils.formatEther(balanceBn));
      });
      this.tokenContract['balanceOf'](this.walletAddress)
        .then((tokenBalanceBn: BigNumber) => {
          this.tokenBalance = parseFloat(
            ethers.utils.formatEther(tokenBalanceBn)
          );
        }
        );
      this.tokenContract['getVotes'](this.walletAddress).then(
        (votePowerBn: BigNumber) => {
          this.votePower = parseFloat(
            ethers.utils.formatEther(votePowerBn));
        }
      );
    }
    if (this.ballotContractAddress && this.walletAddress) {
      this.ballotContract = new ethers.Contract(
        this.ballotContractAddress,
        ballotJson.abi,
        this.wallet
      );

      this.ballotContract['winnerName']().then(
        (winnerName: any) => {
          this.ballotResults = ethers.utils.parseBytes32String(winnerName);
        }
      );
    }
  }

  request(amtToken: string){
    console.log("Trying to mint to " + this.walletAddress);
    this.http
    .post<any>('http://localhost:3000/request-tokens', {mintToAddress: this.walletAddress, tokenAmnt: amtToken})
    .subscribe((ans) => {
      console.log(ans);
    });

  }

  delegate(){
    console.log("delegating");
    this.http
    .post<any>('http://localhost:3000/self-delegate', {delegatee: this.walletAddress})
    .subscribe((ans) => {
      console.log(ans);
    });

  }

  vote(proposalId: string, amount: string){
    console.log("voting");
    this.http
    .post<any>('http://localhost:3000/vote', {proposalId: proposalId, amount: amount})
    .subscribe((ans) => {
      console.log(ans);
    });

  }


}
