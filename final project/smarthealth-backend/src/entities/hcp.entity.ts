import { ApiProperty } from '@nestjs/swagger';

export class HCP {
  @ApiProperty({
    example: 'Elizabeth Hospital',
    description: 'Health Care Provider name',
  })
  name: string;

  @ApiProperty({
    enum: ['vital', 'summary'],
    description: 'Type of authorisation',
  })
  auth: string;

  @ApiProperty({
    example: 'Allow access for treatment reference',
    description: 'Reason to authorise',
  })
  reason: string;
}