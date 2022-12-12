import { ApiProperty } from '@nestjs/swagger';

export class EHR {
  @ApiProperty({ example: 'Joe Smith', description: 'Name of the patient' })
  name: string;

  @ApiProperty({ example: 25, description: 'Age of the patient' })
  age: number;

  @ApiProperty({
    example: 'Male',
    description: 'Sex of the patient',
  })
  sex: string;

  @ApiProperty({ example: 70, description: 'Height of the patient' })
  height: number;

  @ApiProperty({ example: 150, description: 'Weight of the patient' })
  weight: number;

  @ApiProperty({ example: 75, description: 'Heart rate of the patient in bpm' })
  heartRate: number;

  @ApiProperty({
    example: '120/80',
    description: 'Name of the patient in mm Hg',
  })
  bloodPressure: string;

  @ApiProperty({
    example: 98,
    description: 'Oxygen saturation of the patient in %',
  })
  oxygenSaturation: number;

  @ApiProperty({
    example: 99.5,
    description: 'Temperature of the patient in Farenheit',
  })
  temperature: number;
}
