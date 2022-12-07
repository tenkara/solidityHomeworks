import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators';
import { Query } from '@nestjs/common/decorators';
import { Address } from 'cluster';
import { ethers } from 'ethers';
import { stringify } from 'querystring';
import { AppService, ehrDTO, authorizeDTO } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ehr-address')
  getEhrContractAddress() {
    return { result: this.appService.getEhrContractAddress() };
  }

  // Todo: Get and Post methods for Owner, HCP sign up screens, and any backend services to test with SwaggerHub

  // TODO: Back-end script with end-point for Create EHR screen (Ken)
  // TODO: Back-end script with end-point for Authorize EHR to HCP screen (Ken)
  // TODO: Back-end script with end-point for HCP patient info screen (Ken)

  @Post('create')
  create(@Body() body: ehrDTO): Promise<{ txHash: string }> {
    return this.appService.create(body);
  }

  @Post('authorize')
  authorize(@Body() body: authorizeDTO): Promise<{ txHash: string }> {
    return this.appService.authorize(body);
  }

  @Get('view')
  view(): Promise<any> {
    return this.appService.view();
  }
}
