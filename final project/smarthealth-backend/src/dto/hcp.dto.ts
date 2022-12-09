import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthorizeHCPDto {
  @ApiProperty({
    example: 'Elizabeth Hospital',
    description: 'Health Care Provider name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    enum: ['vital', 'summary'],
    description: 'Type of authorisation',
  })
  @IsString()
  readonly auth: string;

  @ApiProperty({
    example: 'Allow access for treatment reference',
    description: 'Reason to authorise',
  })
  @IsString()
  readonly reason: string;
}