This is the repo for week 4 homework.
The voting dApp contains front-end written in Angular and Bootstrap.
The back-end is implemented using Nestjs

EthDever Solidity Bootcamp Group 6 Week 4 Homework
19 November 2022

Name: Raj Nakka 
Discord handle: @rajayana

Github Repo - for week 4 homework: 
https://github.com/tenkara/solidityHomeworks/tree/main/week4

MyToken.sol contract deployed on Goerli testnet at: https://goerli.etherscan.io/address/0xdC0FF2Ce170c2E1c130960c7E64A2b18eAD3266F

TokenizedBallot.sol Contract deployed on Goerli testnet at: 
https://goerli.etherscan.io/address/0x9765fe8fb5642e90982E2C8F5257CF2534F68484

Summary of my homework:
Developed the front end and back end functionality for the Tokenized Ballot dApp
Collaborated with my team on the homework
Tested the functionality on Goerli Testnet
Committed working software to Github

Front End UI:


Front end features:
Create a new [Random] Wallet workflow
Sign in with the new wallet to interact with Token and Ballot smart contracts
Loose coupling functionality between the front and back end to interact with Goerli testnet Ethereum blockchain:
Display the account, Token and Ballot smart contract addresses
Read account balance, token balance and voting power from the blockchain
Request Token feature to mint and update the blockchain
Ballot proposals feature to display the proposals
Voting feature to cast vote on a proposal
Tally votes and display winner

Back end features and Swagger Hub testing:


Backend Features:
Get /token-address: Returns the Token smart contract address of the previously deployed contract in week 3 homework from Goerli testnet
Post /request-token: For minting a specified number of tokens to an address
Post /self-delegate: For activating checkpoints and self tracking voting power
Get /voting-power/(address): Returns the voting power of an address for the Ballot
Get /token-balance/(address): Returns the available tokens at an address
Get /ballot-address: Returns the Ballot contract address
Get /proposals: Returns the Proposals in the Ballot
Get /winning-proposal: Returns the winning proposal number and name in the Ballot
Post /cast-vote: Takes in vote from an account, performs checks, updates blockchain
mintedTokens dto: Object to support token minting
delegatedTokens dto: Object to support token self delegation
castVote dto: Object to support casting votes

Transactions snapshot:
Token contract:



Ballot contract:



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

