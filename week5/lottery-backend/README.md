# Cheatsheet for reusing the backend project we made in the class to run on local hardhat blockchain and connect to metamask wallet


```shell
In [windows] terminal 1:
cd lottery-backend
yarn hardhat node This should startup an instance of Hardhat Network
you can use the ether from the accounts in this terminal to import the account and ether using the private key

In [windows] terminal 2:
yarn hardhat --network localhost run .\scripts\Lottery.ts
This should deploy the contract whose address you can get from [windows] terminal 1

```
