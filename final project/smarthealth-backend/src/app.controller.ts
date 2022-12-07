import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators';
import { Query } from '@nestjs/common/decorators';
import { Address } from 'cluster';
import { ethers } from 'ethers';
import { stringify } from 'querystring';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ehr-address')
  getEhrContractAddress() {
    return { result: this.appService.getEhrContractAddress() };
  }

// Todo: Get and Post methods for Owner, HCP sign up screens, and any backend services to test with SwaggerHub

}
