import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiKeyStatus } from '@prisma/client';

export class UpdateKeyRequest {
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

  @ApiProperty({ description: 'Api Key', required: true })
  @IsString({ message: 'apiKey must be a string' })
  @IsNotEmpty({ message: 'apiKey is required' })
  apiKey: string;

  @ApiProperty({
    description: 'Api Key Status',
    required: false,
    enum: ApiKeyStatus,
    enumName: 'ApiKeyStatus',
  })
  @IsEnum(ApiKeyStatus, { message: 'status must be a valid ApiKeyStatus' })
  status: ApiKeyStatus;
}
