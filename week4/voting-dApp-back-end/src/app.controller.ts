import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators';
import { Query } from '@nestjs/common/decorators';
import { Address } from 'cluster';
import { ethers } from 'ethers';
import { stringify } from 'querystring';
import { AppService, delegatedTokens, mintedTokens, voteInfo } from './app.service';

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

  @Post('vote')
  async vote(@Body() body: voteInfo): Promise<string> {
    return await this.appService.vote(body.proposalId, body.amount);
  }

  @Get('voting-power/:address')
  checkVotingPower(@Param ('address') address: string): Promise<number> {
    return this.appService.checkVotingPower(address)
  }

  @Get('token-balance/:address')
  tokenBalance(@Param ('address') address: string): Promise<number> {
    return this.appService.tokenBalance(address)
  }
}