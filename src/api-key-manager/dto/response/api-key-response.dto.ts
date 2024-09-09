import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyResponseDto {
  constructor(newApiKey?: string, expiryDate?: Date, description?: string) {
    this.apiKey = newApiKey;
    this.expiredAt = expiryDate;
    this.description = description;
  }

  @ApiProperty({ readOnly: true })
  apiKey: string | undefined;

  @ApiProperty({ readOnly: true })
  expiredAt: Date | undefined;

  @ApiProperty({ readOnly: true })
  description: string | undefined;

  @ApiProperty()
  tierName: string;

  @ApiProperty()
  limit: number;

  static build(data: any) {
    const response = new ApiKeyResponseDto();
    response.apiKey = data?.apiKey;
    response.expiredAt = data?.expiredAt;
    response.description = data?.tier?.description ?? data?.description ?? '';
    response.tierName = data?.tier?.name ?? '';
    response.limit = data?.tier?.limit ?? 0;
    return response;
  }
}
