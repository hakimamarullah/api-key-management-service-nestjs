import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTierRequest {
  @ApiProperty({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ required: true })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'TTL must be a number' },
  )
  ttl: number;

  @ApiProperty({ required: true })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'Limit must be a number' },
  )
  limit: number;

  @ApiProperty({ required: true })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'TTL must be a number' },
  )
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price: number;
}
