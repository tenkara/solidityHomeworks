import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';
import ballotJson from '../assets/TokenizedBallot.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.BaseProvider | undefined;

  tokenContractAddress: string | undefined;
  ballotContractAddress: string | undefined;

  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;
  winnerName: string | undefined;

  tokenContract: ethers.Contract | undefined;
  ballotContract: ethers.Contract | undefined;
  
  // Almost a crime to do this below instead of injecting through config service
  constructor(private http: HttpClient) {

  }

  createWallet() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.http.get<any>("http://localhost:3000/token-address")
    .subscribe((ans) => {
      this.tokenContractAddress = ans.result;
      if (this.tokenContractAddress && this.wallet) {
        this.tokenContract = new ethers.Contract(this.tokenContractAddress, tokenJson.abi, this.wallet)
        this.wallet.getBalance().then((balanceBN) => {
          this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
        });
        this.tokenContract['balanceOf'](this.wallet.address).then(
          (tokenBalanceBn: BigNumber) => {
          this.tokenBalance = parseFloat(
            ethers.utils.formatEther(tokenBalanceBn)
          );
        });
        this.tokenContract['getVotes'](this.wallet.address).then(
          (votePowerBn: BigNumber) => {
          this.votePower = parseFloat(
            ethers.utils.formatEther(votePowerBn)
          );
        });
        this.http.get<any>("http://localhost:3000/ballot-address")
        .subscribe((ans) => {
          this.ballotContractAddress = ans.result;
        });
      }
    });
  }
  
  vote(voteId: string){
    console.log("Voting in progress for account: " + voteId);
    // Todo for homework
    // this.ballotContract["vote"](voteId);
    this.http.get<any>("http://localhost:3000/ballot-address")
    .subscribe((ans) => {
      this.ballotContractAddress = ans.result;

      if(this.ballotContractAddress && this.wallet) {
        console.log("Creating Ballot contract instance");
        this.ballotContract = new ethers.Contract(this.ballotContractAddress, ballotJson.abi, this.wallet);
        console.log("Post request to cast vote in progress...");
        this.http.post<any>("http://localhost:3000/cast-vote", {
          voterAddress: this.wallet?.address,
          proposal: voteId,
          tokenAmount: "1"
        })
        .subscribe((ans) => {
          console.log(ans.result);
        });
        this.http.get<any>("http://localhost:3000/winning-proposal")
        .subscribe((ans) => {
          console.log(`winner is: ${ans.result}`);
          this.winnerName = ans.result;
        });
      }
    })
  }

  request(tokenAmount: string) {
    this.http.post<any>("http://localhost:3000/request-tokens", {
      mintToAddress: this.wallet?.address,
      tokenAmnt: tokenAmount
    })
    .subscribe((ans) => {
      console.log(ans);
    });
  }
}
