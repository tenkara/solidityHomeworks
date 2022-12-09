import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators';
import { Query } from '@nestjs/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CreateEHRDto } from './dto/ehr.dto';
import { AuthorizeHCPDto } from './dto/hcp.dto';
import { EHR } from './entities/ehr.entity';
import { HCP } from './entities/hcp.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('check/pre')
  @ApiOperation({ summary: 'Preflight check on patient/HCP address' })
  checkSignersAddress(): Promise<any> {
    return this.appService.checkSignersAddress();
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
}
