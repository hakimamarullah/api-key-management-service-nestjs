import { ApiKeyStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateKeyResponse {
  @ApiProperty()
  isValid: boolean;

  @ApiProperty({ enum: ApiKeyStatus })
  status: ApiKeyStatus;

  @ApiProperty()
  expiryDate: Date;

  @ApiProperty()
  tierName: string;

  static build(data: any) {
    const response = new ValidateKeyResponse();
    response.isValid = data?.isValid;
    response.status = data?.status;
    response.expiryDate = data?.expiryDate;
    response.tierName = data?.tier?.name;
    return response;
  }
}
