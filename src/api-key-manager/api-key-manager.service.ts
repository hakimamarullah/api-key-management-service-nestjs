import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CachingService } from '../caching/caching.service';
import { CacheConstant } from '../caching/cache.constant';
import { BaseResponse } from '../dto/baseResponse.dto';
import { ApiKeyResponseDto } from './dto/response/api-key-response.dto';
import {
  addDays,
  generateApiKey,
  next30Days,
} from '../common/utils/common.util';
import { ApiKeyTierDto } from './dto/api-key-tier.dto';
import { RotateApiKeyDto } from './dto/rotate-api-key.dto';
import { GenerateKeyRequest } from './dto/request/generateKey.request';
import { ApiKeyStatus } from '@prisma/client';
import { ValidateKeyResponse } from './dto/response/validateKey.response';
import { CreateTierRequest } from './dto/request/createTier.request';
import { UpdateTierRequest } from './dto/request/updateTier.request';

@Injectable()
export class ApiKeyManagerService {
  constructor(
    private prismaService: PrismaService,
    private cachingService: CachingService,
  ) {}

  async validateApiKey(apiKey?: string) {
    if (!apiKey) {
      return BaseResponse.getBadRequestResponse(null, 'Missing api key');
    }
    const getApiKeyDb = async () => {
      return this.prismaService.apiKey.findFirstOrThrow({
        where: {
          apiKey: {
            equals: apiKey,
          },
          status: ApiKeyStatus.ACTIVE,
        },
        include: {
          tier: true,
        },
      });
    };

    const apiKeyData = await this.cachingService.getDataOrElseGet(
      `${CacheConstant.CacheKey.API_KEY}-${apiKey}`,
      getApiKeyDb,
    );
    if (!apiKeyData) {
      throw new NotFoundException('API Key not found');
    }

    return BaseResponse.getSuccessResponse(
      ValidateKeyResponse.build(apiKeyData),
    );
  }

  async generateApiKey(request: GenerateKeyRequest) {
    const { tierId: apiKeyTier, username } = request;

    const oldApiKey = await this.prismaService.apiKey.findFirst({
      where: {
        tierId: apiKeyTier,
        owner: username,
        status: ApiKeyStatus.ACTIVE,
      },
    });

    let expiryDate: Date;
    let description: string;
    const newApiKey: string = generateApiKey();
    if (oldApiKey) {
      expiryDate = addDays(<Date>oldApiKey['expiredAt'], 30);
      description = 'You old api-key is replaced by new one';
      await this.prismaService.apiKey.update({
        where: {
          id: oldApiKey['id'],
        },
        data: {
          status: ApiKeyStatus.REPLACED,
        },
      });
    } else {
      expiryDate = next30Days();
      description = 'New api-key generated';
    }
    await this.prismaService.apiKey.create({
      data: {
        apiKey: newApiKey,
        expiredAt: expiryDate,
        tierId: apiKeyTier,
        owner: username,
        status: ApiKeyStatus.ACTIVE,
      },
    });
    return BaseResponse.getSuccessResponse<ApiKeyResponseDto>(
      new ApiKeyResponseDto(newApiKey, expiryDate, description),
    );
  }

  async getAvailableTiers() {
    const data = await this.prismaService.apiKeyTier.findMany();
    const result = data.map((item: any) => ApiKeyTierDto.build(item));
    return BaseResponse.getSuccessResponse<ApiKeyTierDto[]>(result);
  }

  async rotateKey(apiKeyDto: RotateApiKeyDto) {
    const newApiKey: string = generateApiKey();
    const expiryDate: Date = next30Days();
    await this.prismaService.apiKey.update({
      where: {
        apiKey_tierId: {
          apiKey: apiKeyDto.apiKey,
          tierId: apiKeyDto.tierId,
        },
      },
      data: {
        apiKey: newApiKey,
        expiredAt: expiryDate,
      },
    });

    return BaseResponse.getSuccessResponse<ApiKeyResponseDto>(
      new ApiKeyResponseDto(newApiKey, expiryDate),
    );
  }

  async createTier(createTierDto: CreateTierRequest) {
    const data = await this.prismaService.apiKeyTier.create({
      data: createTierDto,
    });
    return BaseResponse.getSuccessResponse<ApiKeyTierDto>(
      ApiKeyTierDto.build(data),
    );
  }

  async deleteTier(id: number) {
    const data = await this.prismaService.apiKeyTier.delete({
      where: {
        id,
      },
    });
    return BaseResponse.getSuccessResponse<any>(data);
  }

  async updateTier(updateTierDto: UpdateTierRequest) {
    const data = await this.prismaService.apiKeyTier.update({
      where: {
        name: updateTierDto.name,
      },
      data: updateTierDto,
    });
    return BaseResponse.getSuccessResponse<any>(data);
  }
}
