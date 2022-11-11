# This Ballot Project demonstrates an on-chain ballot voting system consisting of proposals that voters can vote on for a winning proposal by following the rules of the Ballot.sol contract.

This project uses yarn (as package manager), hardhat (as self contained dev environment to deploy and run the Ballot contract locally on a virtualized ethereum node), ethers.js (for connecting to a public blockchain testnet (Goerli), Typescript for writing tests with TDD approach, mocha test framework, chai for TDD/BDD assertions, and dotenv for loading the environment.

Run the following tasks to build, deploy and use the contract to vote on proposals:

git clone this repo to your local environment

ensure node, yarn are installed

yarn install

yarn compile

yarn config set nodeLinker node-modules

yarn add hardhat --dev

yarn hardhat init

  "Create a Typescript project"

  .gitignore? y
  
yarn add --dev [list of suggested dev dependencies from running the above command]

yarn add mocha --dev

code .
