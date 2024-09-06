import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RotateApiKeyDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Old API Key is required' })
  @IsString({ message: 'Old API Key must be a string' })
  apiKey: string;

  @ApiProperty({ description: 'Api Key Tier ID', required: true })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'tierId must be a number' },
  )
  tierId: number;
}
