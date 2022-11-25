import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators';
import { Query } from '@nestjs/common/decorators';
import { Address } from 'cluster';
import { ethers } from 'ethers';
import { stringify } from 'querystring';
import { AppService, castVoteDto, delegatedTokens, mintedTokens } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-address')
  getTokenAddress() {
    return { result: this.appService.getTokenAddress() };
  }

  @Post('request-tokens')
  async requestTokens(@Body() body: mintedTokens): Promise<string> {
    return await this.appService.requestTokens(body.mintToAddress, body.tokenAmnt);
  }

  @Post('self-delegate')
  async selfDelegate(@Body() body: delegatedTokens): Promise<string> {
    return await this.appService.selfDelegate(body.delegatee);
  }

  @Get('voting-power/:address')
  checkVotingPower(@Param ('address') address: string): Promise<number> {
    return this.appService.checkVotingPower(address)
  }

  @Get('token-balance/:address')
  tokenBalance(@Param ('address') address: string): Promise<number> {
    return this.appService.tokenBalance(address)
  }

  @Get('ballot-address')
  getBallotAddress() {
    return { result: this.appService.getBallotAddress() };
  }

  @Get('proposals/:id')
  getProposals(@Param ('id') id:number) {
    return this.appService.getProposal(id);
  }

  @Get('winning-proposal')
  async getWinner() {
    return  { result: await this.appService.getWinner() };
  }

  @Post('cast-vote')
  async castVote(@Body() body: castVoteDto): Promise<{ result: string }> {
    return { result: (await this.appService.castVote(body.voterAddress, body.proposal, body.tokenAmount)) };
  }
}