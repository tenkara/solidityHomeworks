import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators';
import { Query } from '@nestjs/common/decorators';
import { Address } from 'cluster';
import { ethers } from 'ethers';
import { stringify } from 'querystring';
import { AppService, rolePlayDTO } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateEHRDto } from './dto/ehr.dto';
import { AuthorizeHCPDto } from './dto/hcp.dto';
import { EHR } from './entities/ehr.entity';
import { HCP } from './entities/hcp.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('signed-name/address?')
  // initializeAccounts(@Param ('address') address: string): Promise<{ result: string }> {
  //   return this.appService.initializeAccounts(address);
  // }

  @Get('signed-name/address?')
  initializeAccounts(@Query('address') address: string): Promise<any> {
    return this.appService.initializeAccounts(address);
  }

  @Get('check/role')
  @ApiOperation({ summary: 'Check signer role by address' })
  role(@Query('address') address: string): Promise<any> {
    return this.appService.getRole(address);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create EHR for a patient and deploying contract' })
  create(
    @Body() body: CreateEHRDto,
  ): Promise<{ contractAddress: string; data: EHR }> {
    return this.appService.create(body);
  }

  @Post('authorize')
  @ApiOperation({ summary: "Authorize HCP to access patient's EHR" })
  authorize(
    @Body() body: AuthorizeHCPDto,
  ): Promise<{ txHash: string; data: HCP }> {
    return this.appService.authorize(body);
  }

  @Get('view/summary')
  @ApiOperation({ summary: "View patient's summary" })
  viewSummary(@Query('address') address: string): Promise<any> {
    return this.appService.viewPatientSummary(address);
  }

  @Get('view/vitals')
  @ApiOperation({ summary: "View patient's vitals" })
  viewVitals(@Query('address') address: string): Promise<any> {
    return this.appService.viewPatientVitals(address);
  }

  @Get('view/hcp')
  @ApiOperation({ summary: 'View HCP details' })
  viewHCPDetails(): Promise<any> {
    return this.appService.viewHCPDetails();
  }
}
