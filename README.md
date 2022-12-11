# Web3, Blockchain, Solidity classwork and homeworks from the Oct - Dec 2022 EthDenver Encode Bootcamp :joy: 
(https://github.com/tenkara/solidityHomeworks)
### Contains homeworks and the final Capstone project from the bootcamp

### Week 1 - Primarily in Remix exercising basics of Solidity, create, deploy, interact and transfer using HelloWorld smart contract
### Week 2 - Ballot smart contract tdd, scripts development, deployment of the smart contract to a public blockchain testnet and interaction with group members on various voting related functions of the deployed smart contract

### Week 3 - Building on Week2, creating a tokenized ballot to cast votes, mint tokens, delegate votes, transfer tokens, query results for winning proposal. ** Implemented the homework with my WSD (Working Software Demo) quick feedback loop and rapid iterations approach **
#### Key features
    1. OpenZeppelin Contracts
    2. Operating the contracts with scripts
    3. Testing with TDD and BDD
    4. ERC20Votes, ERC20 Extensions
    5. Smart contracts - Token + Ballot completion, build and execute scripts, Goerli network transactions and interactions

### Week 4 - Created a voting dApp. Learnt about Architecture, design and implementation using Node, Typescript, NestJS framework and API implementation, Swagger UI, Angular and Bootstrap minimal front-end along with several supporting tools to pull it all together.

### Week 5 - Learnt about Gas optimization, overflow/underflow, Smart contract security, Gas limit and loops, updating contracts, using signatures, randomness and Lottery dApp front-end. I took this opportunity to do my own exploration into Signatures, Signers, Transactions and front-end Web3 user interactions

### Week 6 - Blockchain scaling, Layer 2 examples, Solidity advanced content, ECDSA, DeFi, Upgradeability Patterns, iPFS web3 storage, Smart contract security and toolbox.
### Week 7 - Ideation and Sponsor week - Metis, Livepeer, ENS, AltLayer
1. I presented my capstone project idea in the class - ** SmartHealth ** - Building Smart Healthcare using Blockchain and Web3 
2. Thought I was going to do the project by myself but found overwhelming interest from a lot of the classmates  
3. Laid out the WSD iterations and worked with everyone who wanted to contribute in their own way. It is awesome!


## SmartHealth WSD 1 (Dec 5 - Dec 11):
(https://github.com/tenkara/solidityHomeworks/tree/main/final%20project)

   1. Front-end and Back-end templates, Repo and config set up and integration, merge changes, build and release (Raj)
   2. Owner Sign-in screen (Raj)
   3. Owner Create EHR screen (Lean)
   4. Owner Authorize EHR to HCP screen (Lean)
   5. HCP Sign-in screen (Raj)
   6. HCP patient info screen (Hali)
   7. Exit function on front-end screen (just leave it out for now. Refresh the web page instead)
   8. Back-end script with end-point for Owner sign-in (Raj)
   9. Back-end script with end-point for Create EHR screen (Ken)
   10. Back-end script with end-point for Authorize EHR to HCP screen (Ken)
   11. Back-end script with end-point for HCP sign-in (Raj)
   12. Back-end script with end-point for HCP patient info screen (Ken)
   13. Solidity Smart Contract with functions to Create a EHR contract, Store data from screen 3c via 3i, View data in the contract (keeping it fairly straightforward to begin with) (Gabe)
   14. Testing / QA / Anything else missing from above - All interested parties who want to run the app in their environment after the build and provide/use feedback to fix and increment from there.(Jorge)


## SmartHealth WSD 2 (Dec 12 - Dec 15):
(https://github.com/tenkara/solidityHomeworks/tree/main/final%20project)

   1. Product Integration, Build and Release (Raj)
   2. SmartHealth Website (Raj)
   3. Front-end Encrypt Health Record (Raj)
   4. Front-end Decrypt Health Record (Raj)
   5. Front-end Encrypt and Send off-chain (Raj)
   6. Front-end Encrypt and Send on-chain (Raj)
   7. Front-end Find best Healthcare providers / procedures (Raj)
   8. Front-end Patient/Owner view EHR summary and history (open)
   9. Front-end Patient/Owner update their own EHR (open)
   10. Front-end Patient/Owner Appointment Check-in form (open)
   11. Front-end Patient/Owner Request Prescription Refill (open)
   12. Front-end Patient/Owner Manage Payments (open)
   13. Front-end HCP view EHR history (open)
   14. Front-end HCP update EHR (open)
   15. Smart-Contract SmartHealth Patient contract updates for bug fixes as needed (open)
   16. Smart-Contract Create EIP-712 Verifying contract (Raj/Open collab)
   17. Smart-Contract Create Patient/Owner Payment management contract (open)
   18. Back-end API end-point to support Patient/Owner EHR vitals history (open)
   19. Back-end API end-point to update a Patient's EHR from Owner (open)
   20. Back-end API end-point to update a Patient's EHR from HCP (open)
   21. Back-end API end-point to support payment management from patient to HCPs (open)

### How to fix Angular / Bootstrap issues with environment setup for issues you may face in doing i2 tasks:

### While in the smarthealth-frontend directory in a terminal 
* yarn add or npm install these modules -
  * crypto-browserify stream-browserify assert stream-http https-browserify os-browserify buffer
* Add this in the "CompilerOptions": {[...]} section of tsconfig.json
  * "paths" : {
      "crypto": ["./node_modules/crypto-browserify"],
      "stream": ["./node_modules/stream-browserify"],
      "assert": ["./node_modules/assert"],
      "http": ["./node_modules/stream-http"],
      "https": ["./node_modules/https-browserify"],
      "os": ["./node_modules/os-browserify"],
    }
* Add these lines to /src/polyfills.ts
  * (window as any).global = window;
  * import { Buffer } from 'buffer';
  * window.Buffer = Buffer;
  * (window as any).process = {env: { DEBUG: undefined },};
* Add these lines to compilerOptions block in /src/tsconfig.app.json
  * "types": ["node"]
* Please see my package.json, tsconfig.json, tsconfig.app.json, environment.ts for any miscellaneous config related settings or issues and reuse as needed
