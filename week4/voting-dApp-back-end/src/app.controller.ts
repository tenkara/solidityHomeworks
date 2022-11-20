import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators';
import { Query } from '@nestjs/common/decorators';
import { Address } from 'cluster';
import { ethers } from 'ethers';
import { stringify } from 'querystring';
import { AppService, mintedTokens } from './app.service';

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
}