"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const readline = __importStar(require("readline"));
let contract;
let token;
let accounts;
const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1;
async function main() {
    await initContracts();
    await initAccounts();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    mainMenu(rl);
}
async function initContracts() {
    const contractFactory = await hardhat_1.ethers.getContractFactory("Lottery");
    contract = await contractFactory.deploy("LotteryToken", "LT0", TOKEN_RATIO, hardhat_1.ethers.utils.parseEther(BET_PRICE.toFixed(18)), hardhat_1.ethers.utils.parseEther(BET_FEE.toFixed(18)));
    await contract.deployed();
    const tokenAddress = await contract.paymentToken();
    const tokenFactory = await hardhat_1.ethers.getContractFactory("LotteryToken");
    token = tokenFactory.attach(tokenAddress);
}
async function initAccounts() {
    accounts = await hardhat_1.ethers.getSigners();
}
async function mainMenu(rl) {
    menuOptions(rl);
}
function menuOptions(rl) {
    rl.question("Select operation: \n Options: \n [0]: Exit \n [1]: Check state \n [2]: Open bets \n [3]: Top up account tokens \n [4]: Bet with account \n [5]: Close bets \n [6]: Check player prize \n [7]: Withdraw \n [8]: Burn tokens \n", async (answer) => {
        console.log(`Selected: ${answer}\n`);
        const option = Number(answer);
        switch (option) {
            case 0:
                rl.close();
                return;
            case 1:
                await checkState();
                mainMenu(rl);
                break;
            case 2:
                rl.question("Input duration (in seconds)\n", async (duration) => {
                    try {
                        await openBets(duration);
                    }
                    catch (error) {
                        console.log("error\n");
                        console.log({ error });
                    }
                    mainMenu(rl);
                });
                break;
            case 3:
                rl.question("What account (index) to use?\n", async (index) => {
                    await displayBalance(index);
                    rl.question("Buy how many tokens?\n", async (amount) => {
                        try {
                            await buyTokens(index, amount);
                            await displayBalance(index);
                            await displayTokenBalance(index);
                        }
                        catch (error) {
                            console.log("error\n");
                            console.log({ error });
                        }
                        mainMenu(rl);
                    });
                });
                break;
            case 4:
                rl.question("What account (index) to use?\n", async (index) => {
                    await displayTokenBalance(index);
                    rl.question("Bet how many times?\n", async (amount) => {
                        try {
                            await bet(index, amount);
                            await displayTokenBalance(index);
                        }
                        catch (error) {
                            console.log("error\n");
                            console.log({ error });
                        }
                        mainMenu(rl);
                    });
                });
                break;
            case 5:
                try {
                    await closeLottery();
                }
                catch (error) {
                    console.log("error\n");
                    console.log({ error });
                }
                mainMenu(rl);
                break;
            case 6:
                rl.question("What account (index) to use?\n", async (index) => {
                    const prize = await displayPrize(index);
                    if (Number(prize) > 0) {
                        rl.question("Do you want to claim your prize? [Y/N]\n", async (answer) => {
                            if (answer.toLowerCase() === "y") {
                                try {
                                    await claimPrize(index, prize);
                                }
                                catch (error) {
                                    console.log("error\n");
                                    console.log({ error });
                                }
                            }
                            mainMenu(rl);
                        });
                    }
                    else {
                        mainMenu(rl);
                    }
                });
                break;
            case 7:
                await displayTokenBalance("0");
                await displayOwnerPool();
                rl.question("Withdraw how many tokens?\n", async (amount) => {
                    try {
                        await withdrawTokens(amount);
                    }
                    catch (error) {
                        console.log("error\n");
                        console.log({ error });
                    }
                    mainMenu(rl);
                });
                break;
            case 8:
                rl.question("What account (index) to use?\n", async (index) => {
                    await displayTokenBalance(index);
                    rl.question("Burn how many tokens?\n", async (amount) => {
                        try {
                            await burnTokens(index, amount);
                        }
                        catch (error) {
                            console.log("error\n");
                            console.log({ error });
                        }
                        mainMenu(rl);
                    });
                });
                break;
            default:
                throw new Error("Invalid option");
        }
    });
}
async function checkState() {
    const state = await contract.betsOpen();
    console.log(`The lottery is ${state ? "open" : "closed"}\n`);
    if (!state)
        return;
    const currentBlock = await hardhat_1.ethers.provider.getBlock("latest");
    const currentBlockDate = new Date(currentBlock.timestamp * 1000);
    const closingTime = await contract.betsClosingTime();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    console.log(`The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n`);
    console.log(`lottery should close at  ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`);
}
3;
async function openBets(duration) {
    const currentBlock = await hardhat_1.ethers.provider.getBlock("latest");
    const tx = await contract.openBets(currentBlock.timestamp + Number(duration));
    const receipt = await tx.wait();
    console.log(`Bets opened (${receipt.transactionHash})`);
}
async function displayBalance(index) {
    const balanceBN = await hardhat_1.ethers.provider.getBalance(accounts[Number(index)].address);
    const balance = hardhat_1.ethers.utils.formatEther(balanceBN);
    console.log(`The account of address ${accounts[Number(index)].address} has ${balance} ETH\n`);
}
async function buyTokens(index, amount) {
    const tx = await contract.connect(accounts[Number(index)]).purchaseTokens({
        value: hardhat_1.ethers.utils.parseEther(amount).div(TOKEN_RATIO),
    });
    const receipt = await tx.wait();
    console.log(`Tokens bought (${receipt.transactionHash})\n`);
}
async function displayTokenBalance(index) {
    const balanceBN = await token.balanceOf(accounts[Number(index)].address);
    const balance = hardhat_1.ethers.utils.formatEther(balanceBN);
    console.log(`The account of address ${accounts[Number(index)].address} has ${balance} LT0\n`);
}
async function bet(index, amount) {
    const allowTx = await token
        .connect(accounts[Number(index)])
        .approve(contract.address, hardhat_1.ethers.constants.MaxUint256);
    await allowTx.wait();
    const tx = await contract.connect(accounts[Number(index)]).betMany(amount);
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
}
async function closeLottery() {
    const tx = await contract.closeLottery();
    const receipt = await tx.wait();
    console.log(`Bets closed (${receipt.transactionHash})\n`);
}
async function displayPrize(index) {
    const prizeBN = await contract.prize(accounts[Number(index)].address);
    const prize = hardhat_1.ethers.utils.formatEther(prizeBN);
    console.log(`The account of address ${accounts[Number(index)].address} has earned a prize of ${prize} Tokens\n`);
    return prize;
}
async function claimPrize(index, amount) {
    const tx = await contract
        .connect(accounts[Number(index)])
        .prizeWithdraw(hardhat_1.ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    console.log(`Prize claimed (${receipt.transactionHash})\n`);
}
async function displayOwnerPool() {
    const balanceBN = await contract.ownerPool();
    const balance = hardhat_1.ethers.utils.formatEther(balanceBN);
    console.log(`The owner pool has (${balance}) Tokens \n`);
}
async function withdrawTokens(amount) {
    const tx = await contract.ownerWithdraw(hardhat_1.ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    console.log(`Withdraw confirmed (${receipt.transactionHash})\n`);
}
async function burnTokens(index, amount) {
    const allowTx = await token
        .connect(accounts[Number(index)])
        .approve(contract.address, hardhat_1.ethers.constants.MaxUint256);
    const receiptAllow = await allowTx.wait();
    console.log(`Allowance confirmed (${receiptAllow.transactionHash})\n`);
    const tx = await contract
        .connect(accounts[Number(index)])
        .returnTokens(hardhat_1.ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    console.log(`Burn confirmed (${receipt.transactionHash})\n`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
