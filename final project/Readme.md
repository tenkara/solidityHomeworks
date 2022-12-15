## Iteration 1 tasks and contributors -
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
14. Testing / QA / Anything else missing from above - All interested parties who want to run the app in their environment after the build and provide/use feedback to fix and increment from there.

## Iteration 2 
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

### while in the smarthealth-frontend directory in a terminal 
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