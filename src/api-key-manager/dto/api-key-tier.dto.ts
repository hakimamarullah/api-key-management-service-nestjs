import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyTierDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ttl: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  description?: string;

  static build(data: any) {
    const response = new ApiKeyTierDto();
    response.id = data?.id;
    response.name = data?.name;
    response.ttl = data?.ttl;
    response.limit = data?.limit;
    response.description = data?.description;
    response.price = data?.price;
    return response;
  }
}
