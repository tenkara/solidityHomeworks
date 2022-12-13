import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthorizeHCPDto {
  @ApiProperty({
    example: 'Elizabeth',
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
    example: 'Preventive care',
    description: 'Reason to authorise',
  })
  @IsString()
  readonly reason: string;
}
