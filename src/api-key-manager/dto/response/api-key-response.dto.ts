import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyResponseDto {
  constructor(apiKey: string, expiresAt: Date, description?: string) {
    this.apiKey = apiKey;
    this.expiresAt = expiresAt;
    this.description = description ?? '';
  }
  @ApiProperty({ readOnly: true })
  apiKey: string;

  @ApiProperty({ readOnly: true })
  expiresAt: Date;

  @ApiProperty({ readOnly: true })
  description: string;
}
