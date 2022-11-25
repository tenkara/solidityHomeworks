// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { LotteryToken } from "./Token.sol";


contract Lottery is Ownable {
    LotteryToken public paymentToken;
    uint256 public purchaseRatio;
    uint256 public betPrice;
    uint256 public betFee;
    uint256 public closingTimestamp;

    uint256 public ownerPool;
    uint256 public prizePool;

    mapping(address => uint256) prize;

    bool public betsOpen;

    address[] _slots;

    constructor(
        string memory name, 
        string memory symbol, 
        uint256 _purchaseRatio, 
        uint256 _betPrice,
        uint256 _betFee
        ) {
        paymentToken = new LotteryToken(name, symbol);
        purchaseRatio = _purchaseRatio;
        betPrice = _betPrice;
        betFee = _betFee;

    }

    function openBets(uint256 _closingTimestamp) external onlyOwner {
            require(!betsOpen, "The bets are already open!");
            require(_closingTimestamp > block.timestamp, "Closing time should be in future");
            closingTimestamp = _closingTimestamp;
            betsOpen = true;



    }

    function purchaseTokens() external payable{
        paymentToken.mint(msg.sender, msg.value * purchaseRatio);
    }

    function betMany(uint256 times) external {
        while (times > 0){
            times--;
            bet();
        }
    }

    function bet() public onlyWhenBetsOpen {
        paymentToken.transferFrom(msg.sender, address(this), betPrice + betFee);
        //TODO include the msg.sender to be in the game 
        ownerPool += betFee; 
        prizePool += betPrice;

        _slots.push(msg.sender);

    }

    function closeLottery() external {
        require(closingTimestamp <= block.timestamp, "Too soon to close betting.");
        require(betsOpen, "Bets are closed.");

        if(_slots.length > 0){
            uint256 winnerIndex = getRandomNumber() % _slots.length;
            address winner = _slots[winnerIndex];
            prize[winner] += prizePool;
            prizePool = 0;
            delete(_slots);
        }
        betsOpen = false;

        //ToDo pick randomly a winner

    }

    function getRandomNumber() public view returns(uint256 randomNumber){
        randomNumber = block.difficulty;
    }

    

    modifier onlyWhenBetsOpen {
        require(betsOpen, "Bets are closed.");
        require(closingTimestamp > block.timestamp, "Betting has concluded.");
        _;
    }

    //Prize withdraw function

    //ownder Withdraw function  

    //return tokens function

} 