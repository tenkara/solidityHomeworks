## Too much fighting with Angular 15 and had to reinstall front end from scratch with Angular 14

Here is my cheatsheet for the front-end (lesson 15)
- ng new lottery-frontend
- Yes to Angular routing
- Select SCSS for stylesheet
- cd ./lottery-frontend
- ng serve (to test the setup)
- exit (ctrl-c)
- npm install ethers or yarn add ethers
- yarn add bootstrap bootstrap-icons
- yarn add @popperjs/core
- yarn add @ng-bootstrap/ng-bootstrap
- In angular.json be sure to have these lines -
-            "styles": [
-              "node_modules/bootstrap/scss/bootstrap.scss",
-              "node_modules/bootstrap-icons/font/bootstrap-icons.css",
-              "src/styles.scss"
-            ],
-            "scripts": [
-              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
-            ]
- ...
- In app.module.ts be sure to include NgbModule like this -
- import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
- @NgModule({
-  declarations: [
-    AppComponent
-  ],
-  imports: [
-    BrowserModule,
-    AppRoutingModule,
-    NgbModule
-  ],
- ...
- Make sure the following lines are added to tsconfig.json
-  "compilerOptions": {
-    "resolveJsonModule": true,
-    "esModuleInterop": true,
-    "allowSyntheticDefaultImports": true,
-    ...

## Instructions to setup metamask to work with local Hardhat network running the Lottery contract
- Follow the instructions in the Readme file in the lottery-backend
- Import ether from one or more accounts using the account's private key (which should be available from [windows] Terminal 1) to setup metamask account(s) for localhost port 8545, chain id 31337.
- Specifically, the RPC URL should be http://127.0.0.1:8545 and Chain ID should be set to 31337.
- Follow the code in the app.component.ts to connect to Metamask using a Web3Provider. 
