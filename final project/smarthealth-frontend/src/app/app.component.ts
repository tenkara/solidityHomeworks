import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // HTML variables and contents for the landing page
  title = 'SmartHealth';

  // Enable role selection and display the appropriate page
  roleSelected?: number = 0; // 0: Patient, 1: HCP

  // Owner sign-in page variables
  ownerName?: string;
  greeting?: string;

  // Current menu item selected from Owner menu
  ownerMenuSelected?: number = 0; // For menu options

  // Owner create EHR page variables

  // Owner authorize EHR to HCP page variables

  // Owner HCP sign-in page variables
  hcpName?: string;
  hcpAddress?: string;

  // Current menu item selected from HCP menu
  hcpMenuSelected?: number = 0; // For menu options

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
      this.roleSelected = 1; // HCP role for now; TODO: set based on account selected

      this.ownerMenuSelected = -1; // Hide the sign-in button
      this.hcpMenuSelected = -1; // Hide the sign-in button

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

  // Simple listener to callback on owner sign-out menu item
  onOwnerExit(menuSelected: number) {
    this.ownerMenuSelected = menuSelected;
  }

  // Simple listener to callback on HCP Access patient info menu item
  onAccessPatientInfo(menuSelected: number) {
    this.hcpMenuSelected = menuSelected;
  }

  onHcpExit(menuSelected: number) {
    this.hcpMenuSelected = menuSelected;
    console.log(`todo ${menuSelected}`);
  }
}
