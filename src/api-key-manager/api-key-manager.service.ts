import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeyResponseDto } from './dto/response/api-key-response.dto';
import { ApiKeyTierDto } from './dto/api-key-tier.dto';
import { RotateApiKeyDto } from './dto/rotate-api-key.dto';
import { GenerateKeyRequest } from './dto/request/generateKey.request';
import { ApiKeyStatus } from '@prisma/client';
import { ValidateKeyResponse } from './dto/response/validateKey.response';
import { CreateTierRequest } from './dto/request/createTier.request';
import { UpdateTierRequest } from './dto/request/updateTier.request';
import { UpdateKeyRequest } from './dto/request/updateKey.request';
import {
  addDays,
  BaseResponse,
  CacheConstant,
  CachingService,
  generateApiKey,
  next30Days,
} from '@hakimamarullah/commonbundle-nestjs';

@Injectable()
export class ApiKeyManagerService {
  constructor(
    private prismaService: PrismaService,
    private cachingService: CachingService,
  ) {}

  async validateApiKey(apiKey?: string) {
    if (!apiKey) {
      return BaseResponse.getResponse(
        null,
        'Missing api key',
        HttpStatus.BAD_REQUEST,
      );
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

    return BaseResponse.getResponse(ValidateKeyResponse.build(apiKeyData));
  }

  async generateApiKey(request: GenerateKeyRequest) {
    const { tierId: apiKeyTier, username, status, refId } = request;

    const oldApiKey = await this.prismaService.apiKey.findFirst({
      where: {
        tierId: apiKeyTier,
        owner: username,
        status: ApiKeyStatus.ACTIVE,
      },
      include: {
        tier: true,
      },
    });

    let expiryDate: Date;
    let description: string;
    const newApiKey: string = generateApiKey();
    const isFreeTier = (oldApiKey as any)?.tier?.name === 'FREE';
    if (oldApiKey) {
      if (isFreeTier) {
        return BaseResponse.getResponse(
          null,
          'Free tier cannot have more than one active api-key',
          HttpStatus.CONFLICT,
        );
      }
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

    const defaultStatus = isFreeTier
      ? ApiKeyStatus.ACTIVE
      : ApiKeyStatus.INACTIVE;

    await this.prismaService.apiKey.create({
      data: {
        apiKey: newApiKey,
        expiredAt: expiryDate,
        tierId: apiKeyTier,
        owner: username,
        status: status ?? defaultStatus,
        refId: refId,
      },
    });
    return BaseResponse.getResponse<ApiKeyResponseDto>(
      new ApiKeyResponseDto(newApiKey, expiryDate, description),
    );
  }

  async getAvailableTiers() {
    const data = await this.prismaService.apiKeyTier.findMany();
    const result = data.map((item: any) => ApiKeyTierDto.build(item));
    return BaseResponse.getResponse<ApiKeyTierDto[]>(result);
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

    return BaseResponse.getResponse<ApiKeyResponseDto>(
      new ApiKeyResponseDto(newApiKey, expiryDate, 'rotate key'),
    );
  }

  async createTier(createTierDto: CreateTierRequest) {
    const data = await this.prismaService.apiKeyTier.create({
      data: createTierDto,
    });
    return BaseResponse.getResponse<ApiKeyTierDto>(ApiKeyTierDto.build(data));
  }

  async deleteTier(id: number) {
    const data = await this.prismaService.apiKeyTier.delete({
      where: {
        id,
      },
    });
    return BaseResponse.getResponse<any>(data);
  }

  async updateTier(updateTierDto: UpdateTierRequest) {
    const data = await this.prismaService.apiKeyTier.update({
      where: {
        name: updateTierDto.name,
      },
      data: updateTierDto,
    });
    return BaseResponse.getResponse<any>(data);
  }

  async getTierById(id: number) {
    const data = await this.prismaService.apiKeyTier.findFirstOrThrow({
      where: {
        id,
      },
    });
    return BaseResponse.getResponse(ApiKeyTierDto.build(data));
  }

  async updateApiKeyStatus(updateKeyReq: UpdateKeyRequest) {
    const { tierId, username, status, apiKey } = updateKeyReq;
    const data = await this.prismaService.apiKey.update({
      where: {
        apiKey_tierId: {
          apiKey,
          tierId,
        },
        owner: username,
      },
      data: {
        status,
      },
    });
    return BaseResponse.getResponse<any>(data);
  }

  async getActiveApiKeysByUsername(username: string) {
    const data = await this.prismaService.apiKey.findMany({
      where: {
        owner: username,
        status: ApiKeyStatus.ACTIVE,
      },
      include: {
        tier: true,
      },
    });
    const result = data.map((item: any) => ApiKeyResponseDto.build(item));
    return BaseResponse.getResponse<ApiKeyResponseDto[]>(result);
  }
}
