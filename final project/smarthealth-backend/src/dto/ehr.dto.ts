import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateEHRDto {
  @ApiProperty({ example: 'Joe Smith', description: 'Name of the patient' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 25, description: 'Age of the patient' })
  @IsInt()
  readonly age: number;

  @ApiProperty({
    example: 'Male',
    description: 'Sex of the patient',
  })
  @IsString()
  readonly sex: string;

  @ApiProperty({ example: 70, description: 'Height of the patient' })
  @IsInt()
  readonly height: number;

  @ApiProperty({ example: 150, description: 'Weight of the patient' })
  @IsInt()
  readonly weight: number;

  @ApiProperty({ example: 75, description: 'Heart rate of the patient in bpm' })
  @IsInt()
  readonly heartRate: number;

  @ApiProperty({
    example: '120/80',
    description: 'Blood pressure of the patient in mm Hg',
  })
  @IsString()
  readonly bloodPressure: string;

  @ApiProperty({
    example: 98,
    description: 'Oxygen saturation of the patient in %',
  })
  @IsInt()
  readonly oxygenSaturation: number;

  @ApiProperty({
    example: 99.5,
    description: 'Temperature of the patient in Farenheit',
  })
  @IsInt()
  readonly temperature: number;
}
