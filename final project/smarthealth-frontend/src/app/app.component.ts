import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ethers } from 'ethers';
import { FormControl, FormGroup } from '@angular/forms';

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
  contractAddress: string = '';
  name?: string;
  age?: string;
  sex?: number;
  weight?: number;
  height?: number;
  heartRateEHR?: number;
  bloodPressureEHR?: string;
  oxygenSaturationEHR?: number;
  temperatureEHR?: number;

  // Owner authorize EHR to HCP page variables
  HCPName?: string;
  vitals?: string;
  reason?: string;

  // HCP sign-in page variables
  hcpName?: string;
  hcpAddress?: string;

  // Current menu item selected from HCP menu
  hcpMenuSelected?: number = 0; // For menu options
  provider?: ethers.providers.Web3Provider;
  account?: ethers.Wallet;
  signer?: ethers.providers.JsonRpcSigner;
  address: string = ''; // Address of the current account signed in through MetaMask
  signedName?: string; // Name of the current account signed in through MetaMask for later iterations
  signedRole?: string; // Role of the current account signed in through MetaMask

  //HCP acces to patient info
  patientName?: string;
  dob?: string;
  heartRate?: number;
  bloodPressure?: string;
  oxygenSaturation?: number;
  temperature?: number;

  // Owner HCP access patient info page variables
  //Forms
  sub = new FormGroup({
    data: new FormGroup({
      name: new FormControl('John Smith'),
      age: new FormControl(25),
      sex: new FormControl('Male'),
      height: new FormControl(170),
      weight: new FormControl(150),
      heartRate: new FormControl(80),
      bloodPressure: new FormControl('120/70'),
      oxygenSaturation: new FormControl('98%'),
      temperature: new FormControl('99F'),
    }),
  });
  sub2 = new FormGroup({
    hcp: new FormGroup({
      HCPName: new FormControl('Summit Medical Clinic'),
      vitals: new FormControl('1'),
      reason: new FormControl('PCP Referral'),
    }),
  });

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

  submitCreate(data: FormGroup) {
    console.log(data);
    

    this.http
      .post<any>('http://localhost:3000/create', {
        name: this.sub.value.data?.name,
        age: this.sub.value.data?.age,
        sex: this.sub.value.data?.sex,
        weight: this.sub.value.data?.weight,
        height: this.sub.value.data?.height,
        heartRate: this.sub.value.data?.heartRate,
        bloodPressure: this.sub.value.data?.bloodPressure,
        oxygenSaturation: this.sub.value.data?.oxygenSaturation,
        temperature: this.sub.value.data?.temperature,
      })
      .subscribe((ans) => {
        this.contractAddress = ans.contractAddress;
        this.name = ans.data.name;
        this.age = ans.data.age;
        this.sex = ans.data.sex;
        this.weight = ans.data.weight;
        this.height = ans.data.height;
        this.heartRateEHR = ans.data.heartRate;
        this.bloodPressureEHR = ans.data.bloodPressure;
        this.oxygenSaturationEHR = ans.data.oxygenSaturation;
        this.temperatureEHR = ans.data.temperature;
        console.log(
          this.name,
          this.contractAddress,
          this.sex,
          this.weight,
          this.height,
          this.heartRateEHR,
          this.bloodPressureEHR,
          this.oxygenSaturationEHR,
          this.temperatureEHR
        );
      });
  }

  // Simple listener to callback on owner authorize EHR to HCP menu item
  onAuthorizeHCP(menuSelected: number) {
    this.ownerMenuSelected = menuSelected;
  }

  submitAuthorize(hcp: FormGroup) {
    console.log(this.sub2);

    this.http
      .post<any>('http://localhost:3000/authorize', {
        name: this.sub2.value.hcp?.HCPName,
        auth: this.sub2.value.hcp?.vitals,
        reason: this.sub2.value.hcp?.reason,
      })
      .subscribe((ans) => {
        this.HCPName = ans.name;
        this.vitals = ans.auth;
        this.reason = ans.reason;
        console.log(ans.data.name, ans.data.auth, ans.data.reason);
      });
  }

  // Simple listener to callback on owner sign-out menu item
  onOwnerExit(menuSelected: number) {
    this.ownerMenuSelected = menuSelected;
    this.roleSelected = -1;
  }

  // Simple listener to callback on HCP Access patient info menu item
  async onAccessPatientInfo(menuSelected: number) {
    this.hcpMenuSelected = menuSelected;

    let queryParams = new HttpParams().append('address', this.address);

    try {
      // Need the right endpoint for hcp to view patient vitals
      this.http
        .get<any>('http://localhost:3000/view/vitals', {
          params: queryParams,
        })
        .subscribe((ans) => {
          this.heartRate = ans.heartRate;
          this.bloodPressure = ans.bloodPressure;
          this.oxygenSaturation = ans.oxygenSat;
          this.temperature = ans.temperature;
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
}
