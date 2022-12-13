import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ethers } from 'ethers';
import { encrypt } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
    // ethereum?: Window;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // HTML variables and contents for the landing page
  title = 'SmartHealth';

  // Enable role selection and display the appropriate page
  roleSelected?: number = 3; // 0: Owner, 1: HCP, -1: unknown, 3: not selected (used for landing page empty display)

  // Owner sign-in page variables
  ownerName?: string;
  greeting?: string;

  // Current menu item selected from Owner menu
  ownerMenuSelected?: number = 0; // For menu options

  // Owner create EHR page variables

  // Owner authorize EHR to HCP page variables

  // HCP sign-in page variables
  hcpName?: string;
  hcpAddress?: string;

  // Current menu item selected from HCP menu
  hcpMenuSelected?: number = 0; // For menu options
  provider?: ethers.providers.Web3Provider;
  account?: ethers.Wallet;
  signer?: ethers.providers.JsonRpcSigner;
  address?: string; // Address of the current account signed in through MetaMask
  signedName?: string; // Name of the current account signed in through MetaMask for later iterations
  signedRole?: string; // Role of the current account signed in through MetaMask

  //HCP acces to patient info
  patientName?: string;
  dob?: string;
  heartRate?: number;
  bloodPressure?: string;
  oxygenSaturation?: number;
  temperature?: number;
  encryptionKeyDisplay: any;
  encryptedEHR?: any;
  decryptedEHR?: any;

  // Owner HCP access patient info page variables

  constructor(private http: HttpClient) {
    console.log('AppComponent constructor');
  }

  // For later iterations using lifecycle hooks
  ngOnInit(): void {}

  // Connect to MetaMask and sign-in with one of the roles
  async connectWallet() {
    try {
      console.log('connectWallet');

      // Connect to the provider
      this.provider = new ethers.providers.Web3Provider(window.ethereum);

      if (window.ethereum) {
        // Get the account to use for interaction with SmartHealth contract(s)
        let accounts = await this.provider.send('eth_requestAccounts', []);
        console.log(`accounts: ${accounts[0]}, ${accounts[1]}\n`);
        this.signer = await this.provider.getSigner();
        this.address = await this.signer.getAddress();
        let queryParams = new HttpParams().append('address', this.address);
        console.log(`account: ${accounts[0]}\n`);
        console.log(`account: ${await this.signer.getAddress()}\n`);

        this.http
          .get<any>('http://localhost:3000/signed-name/address', {
            params: queryParams,
          })
          .subscribe((ans) => {
            this.signedRole = ans.result;
            console.log(ans.result);
            console.log(this.signedRole);
            if (this.signedRole === 'owner') {
              this.roleSelected = 0;
              console.log('owner role', this.signedRole, this.roleSelected);
            } else if (this.signedRole === 'hcp') {
              this.roleSelected = 1;
              console.log('hcp role', this.signedRole, this.roleSelected);
            } else if (this.signedRole === 'unknown') {
              this.roleSelected = -1;
              console.log('unknown role');
            }
          });

        this.ownerMenuSelected = -1; // Hide the sign-in button
        this.hcpMenuSelected = -1; // Hide the sign-in button
      } else {
        console.log('Unable to process web3 request');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Simple listener to callback on owner create EHR menu item
  onCreateEHR(menuSelected: number) {
    this.ownerMenuSelected = menuSelected;
  }

  // Simple listener to callback on owner authorize EHR to HCP menu item
  onAuthorizeHCP(menuSelected: number) {
    this.ownerMenuSelected = menuSelected;
  }

  async encryptEHR(ehrData: string) {
    console.log('encrypt EHR');
    this.ownerMenuSelected = 3;
    try {
      this.encryptionKeyDisplay = await window.ethereum.request?.({
        method: 'eth_getEncryptionPublicKey',
        params: [this.address],
      });
      console.log(this.encryptionKeyDisplay);
      this.encryptedEHR = bufferToHex(
        Buffer.from(
          JSON.stringify(
            encrypt(
              this.encryptionKeyDisplay,
              {'data':ehrData},
              'x25519-xsalsa20-poly1305',
            )
            ),
            'utf8'
            )
          // this.encryptedMessage =  encrypt(
          //     this.encryptionKeyDisplay,
          //     {'data':ehrData},
          //     'x25519-xsalsa20-poly1305',
          //   )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async decryptEHR() {
    console.log('decrypt EHR');
    this.ownerMenuSelected = 4;
    try {
      this.decryptedEHR = await window.ethereum.request?.({
        method: 'eth_decrypt',
        params: [this.encryptedEHR, this.address],
      });

      console.log(this.decryptedEHR);
    } catch (error) {
      console.log(error);
    }
  }

  // Simple listener to callback on owner sign-out menu item
  onOwnerExit(menuSelected: number) {
    this.ownerMenuSelected = menuSelected;
    this.roleSelected = -1;
  }

  // Simple listener to callback on HCP Access patient info menu item
  onAccessPatientInfo(menuSelected: number) {
    this.hcpMenuSelected = menuSelected;

    let queryParams = new HttpParams().append(
      this.patientName ? this.patientName : 'patientName',
      this.dob ? this.dob : 'dob'
    );

    try {
      // Need the right endpoint for hcp to view patient vitals
      this.http
        .get<any>('http://localhost:3000/view/vitals', {
          params: queryParams,
        })
        .subscribe((ans) => {
          this.heartRate = ans.result.heartRate;
          this.bloodPressure = ans.result.bloodPressure;
          this.oxygenSaturation = ans.result.oxygenSat;
          this.temperature = ans.result.temperature;
        });
    } catch (error) {
      console.log(error);
    }
  }

  onHcpExit(menuSelected: number) {
    this.hcpMenuSelected = menuSelected;
    this.roleSelected = -1;
    console.log(`todo ${menuSelected}`);
  }

  submitPatientInfo(patientName: string, dob: string) {
    this.roleSelected = 1;
    this.hcpMenuSelected = 1;
    console.log(`patient: ${patientName} , dob: ${dob} `);
  }

  onTodo(menuSelected: number) {
    this.ownerMenuSelected = menuSelected;
    console.log('todo ' + menuSelected);
  }
}
