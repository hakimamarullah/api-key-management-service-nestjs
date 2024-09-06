import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GenerateKeyRequest {
  @ApiProperty({
    description: 'username',
    required: true,
  })
  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'username is required' })
  username: string;

  @ApiProperty({ description: 'Api Key Tier ID', required: true })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'tierId must be a number' },
  )
  tierId: number;
}
