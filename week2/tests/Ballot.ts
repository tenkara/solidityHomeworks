import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Chocolate", "Vanilla", "Lemon", "Cookie"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}
// The above function in typeScript using arrow function
// Not easily understood by most. Hence the above function to keep it simpler
// PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop));

describe("Ballot", () => {
    let ballotContract: Ballot;
    let accounts: SignerWithAddress[];
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const ballotContractFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotContractFactory.deploy(
            convertStringArrayToBytes32(PROPOSALS));
        await ballotContract.deployed();
    });

    describe("when the contract is deployed", async () => {
        it("has the provided proposals", async () => {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(ethers.utils.parseBytes32String(proposal.name)).to
                .eq(PROPOSALS[index]);
            }
            // const arrayMemberPos0 = await ballotContract.proposals(0);
            // console.log(arrayMemberPos0);
        })

        it("sets the deployer address as chairperson", async () => {
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.eq(accounts[0].address);
        });

        it("sets the voting weight for the chairperson as 1", async function () {
            
            const chairperson = await ballotContract.chairperson();
            const chairpersonVotingWeight 
            = (await ballotContract.voters(chairperson)).weight;
            expect(chairpersonVotingWeight).to.eq(1);
        });
    });    

    describe("when the chairperson interacts with the giveRightToVote function in the contract", async function () {
        beforeEach( async () => {
            accounts = await ethers.getSigners();
            const selectedVoter = accounts[1].address;
            const acc1Voter = await ballotContract.voters(accounts[1].address);
            console.log(acc1Voter);
            const tx = await ballotContract.giveRightToVote(selectedVoter);
            await tx.wait();
        });
        it("gives right to vote for another address", async function () {
          const acc1Voter = await ballotContract.voters(accounts[1].address);
          expect(acc1Voter.weight).to.eq(1);
        });
        it("can not give right to vote for someone that has voted", async function () {
          const voteTx = await ballotContract.connect(accounts[1]).vote(0);
          await voteTx.wait();
          await expect(ballotContract.giveRightToVote(accounts[1].address)).to.be.revertedWith("The voter already voted.");

        //   expect(acc1Voter.voted).to.eq(true);
        // await expect(ballotContract.giveRightToVote(acc1Voter)).to.be.revertedWith("The voter already voted.");
        });
        it("can not give right to vote for someone that has already voting rights", async function () {
          
            // const acc1Voter = await ballotContract.voters(accounts[1].address);
            // expect(acc1Voter.weight).to.eq(1);
            const selectedVoter = accounts[1].address;
            await expect(ballotContract.giveRightToVote(selectedVoter)).to.be.revertedWithoutReason();
        });
      });
      describe("when the voter interact with the vote function in the contract", function () {
        beforeEach( async () => {
            accounts = await ethers.getSigners();
            const voteTx = await ballotContract.connect(accounts[1]).vote(0);
          await voteTx.wait();
            
        });
        it("should register the vote", async () => {
          throw Error("Not implemented");
        });
      });
});
