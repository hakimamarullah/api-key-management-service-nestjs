import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiKeyStatus } from '@prisma/client';

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

  @ApiProperty({
    description: 'Api Key Status',
    required: false,
    enum: ApiKeyStatus,
    enumName: 'ApiKeyStatus',
  })
  @IsEnum(ApiKeyStatus, { message: 'status must be a valid ApiKeyStatus' })
  status: ApiKeyStatus;

  @ApiProperty({
    description: 'Reference ID',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'referenceId is required' })
  @IsString({ message: 'referenceId must be a string' })
  refId: string;
}
