## EthDever Solidity Bootcamp Group 6 Week 4 Homework
### 21 November 2022

## Summary Report with pictures here - [EthDever Solidity Bootcamp Group 6 Week 4 Homework.pdf](https://github.com/tenkara/solidityHomeworks/files/10067154/EthDever.Solidity.Bootcamp.Group.6.Week.4.Homework.pdf)

Name: Raj Nakka 
Discord handle: @rajayana

Github Repo - for week 4 homework: 
https://github.com/tenkara/solidityHomeworks/tree/main/week4

MyToken.sol contract deployed on Goerli testnet at: https://goerli.etherscan.io/address/0xdC0FF2Ce170c2E1c130960c7E64A2b18eAD3266F

TokenizedBallot.sol Contract deployed on Goerli testnet at: 
https://goerli.etherscan.io/address/0x9765fe8fb5642e90982E2C8F5257CF2534F68484

Summary of my homework:
1. Developed the front end and back end functionality for the Tokenized Ballot dApp
2. Collaborated with my team on the homework
3. Tested the functionality on Goerli Testnet
4. Committed working software to Github
5. The voting dApp contains front-end written in Angular and Bootstrap.
6. The back-end is implemented using Nestjs

Front End UI: Please see the summary report PDF link at the top


Front end features:
1. Create a new [Random] Wallet workflow
2. Sign in with the new wallet to interact with Token and Ballot smart contracts
3. Loose coupling functionality between the front and back end to interact with Goerli testnet Ethereum blockchain:
4. Display the account, Token and Ballot smart contract addresses
5. Read account balance, token balance and voting power from the blockchain
6. Request Token feature to mint and update the blockchain
7. Ballot proposals feature to display the proposals
8. Voting feature to cast vote on a proposal
9. Tally votes and display winner

Back end features and Swagger Hub testing:
Screenshot of Swaggerhub API : Please see the summary report PDF link at the top

Backend Features:
1. Get /token-address: Returns the Token smart contract address of the previously deployed contract in week 3 homework from Goerli testnet
2. Post /request-token: For minting a specified number of tokens to an address
3. Post /self-delegate: For activating checkpoints and self tracking voting power
4. Get /voting-power/(address): Returns the voting power of an address for the Ballot
5. Get /token-balance/(address): Returns the available tokens at an address
6. Get /ballot-address: Returns the Ballot contract address
7. Get /proposals: Returns the Proposals in the Ballot
8. Get /winning-proposal: Returns the winning proposal number and name in the Ballot
9. Post /cast-vote: Takes in vote from an account, performs checks, updates blockchain
10. mintedTokens dto: Object to support token minting
11. delegatedTokens dto: Object to support token self delegation
12. castVote dto: Object to support casting votes

Transactions snapshot:
Token contract:
https://goerli.etherscan.io/txs?a=0xdC0FF2Ce170c2E1c130960c7E64A2b18eAD3266F


Ballot contract:
https://goerli.etherscan.io/address/0x9765fe8fb5642e90982E2C8F5257CF2534F68484


Name: Gabrielle Goodwin
Discord handle: @gabewin

Github Repo - for week 4 homework: 
https://github.com/tenkara/solidityHomeworks/tree/gabewin/week4 

MyToken.sol contract deployed on Goerli testnet at: https://goerli.etherscan.io/address/0x007d4680437174cca622c3ae230df5b7a0a31779

TokenizedBallot.sol Contract deployed on Goerli testnet at: 
https://goerli.etherscan.io/address/0xa4B13aEe3Be9f95d50E043596b55C6d817aD3f20

Summary of my homework:
Developed the front end and back end functionality for the Tokenized Ballot dApp
Back end token functionality was initially cloned from Raj
Collaborated with my team on the homework
Worked with Adrian on git functionality
Tested the functionality on Goerli Testnet
Committed working software to Github

Front End UI:





Front end features:
Enter a wallet address to see values from the blockchain for the deployed contracts
Started functionality to connect to MetaMask but was unable to finish
Able to interact with Token contract to get information for the entered wallet
Display the wallet address, Token contract address, and Ballot contract address
Read account balance, token balance, voting power, and Ballot winner from the blockchain
Request Token feature to mint tokens to the provided wallet and update the blockchain
Voting feature to cast vote on a proposal
This is currently voting from the wallet in my .env file. When connection to MetaMask is established it will vote from connected wallet
Tally votes and display winner


Front End Updates I would like to make
Get MetMask connection working
Update vote to use MetaMask connection
Have it update automatically after minting or voting
Make it prettier
Get proposal details from blockchain, these are currently hard coded
Display more information while transaction is in progress

Back end features and Swagger Hub testing:


Backend Features:
Token-address, request-tokens, self-delegate, voting-power, and token-balance were available in the initial clone from Raj
Added vote and the voteInfo schema for casting votes to the Ballot contract

