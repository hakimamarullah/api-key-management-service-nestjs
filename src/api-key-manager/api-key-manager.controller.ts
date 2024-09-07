import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiBaseResponse,
  ApiParamId,
} from '../common/decorators/swagger.decorator';
import { ApiKeyResponseDto } from './dto/response/api-key-response.dto';
import { ApiKeyManagerService } from './api-key-manager.service';
import { RotateApiKeyDto } from './dto/rotate-api-key.dto';
import { ApiKeyTierDto } from './dto/api-key-tier.dto';
import { GenerateKeyRequest } from './dto/request/generateKey.request';
import { ValidateKeyResponse } from './dto/response/validateKey.response';
import { CreateTierRequest } from './dto/request/createTier.request';
import { UpdateTierRequest } from './dto/request/updateTier.request';

@ApiBearerAuth()
@ApiTags('ApiKeyManager Controller')
@Controller('api-key-manager')
export class ApiKeyManagerController {
  constructor(private apiKeymanager: ApiKeyManagerService) {}
  @Post('generate')
  @ApiOperation({ summary: 'Create new API Key with the given tier and owner' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyResponseDto })
  @ApiBody({ type: GenerateKeyRequest })
  async generateApiKey(@Body() request: GenerateKeyRequest) {
    return this.apiKeymanager.generateApiKey(request);
  }

  @Get('tiers')
  @ApiOperation({ summary: 'List available tiers' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyTierDto, isArray: true })
  async getAvailableTiers() {
    return this.apiKeymanager.getAvailableTiers();
  }

  @Post('rotate')
  @ApiOperation({ summary: 'Rotate API Key' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyResponseDto })
  @ApiBody({ type: RotateApiKeyDto })
  async rotateApiKey(@Body() apiKey: RotateApiKeyDto) {
    return this.apiKeymanager.rotateKey(apiKey);
  }

  @Get('validate/:apiKey')
  @ApiOperation({ summary: 'Validate API Key' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ValidateKeyResponse })
  async validateApiKey(@Param('apiKey') apiKey: string) {
    return this.apiKeymanager.validateApiKey(apiKey);
  }

  @Post('tiers')
  @ApiOperation({ summary: 'Create API Tier' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBaseResponse({ model: ApiKeyTierDto })
  @ApiBody({ type: CreateTierRequest })
  async createTier(@Body() request: CreateTierRequest) {
    return this.apiKeymanager.createTier(request);
  }

  @Delete('tiers/:tierId')
  @ApiOperation({ summary: 'Delete API Tier By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: Object })
  @ApiParamId({ name: 'tierId' })
  async deleteTier(@Param('tierId', ParseIntPipe) tierId: number) {
    return this.apiKeymanager.deleteTier(tierId);
  }

  @Put('tiers')
  @ApiOperation({ summary: 'Update API Tier' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: Object })
  @ApiBody({ type: UpdateTierRequest })
  async updateTier(@Body() request: UpdateTierRequest) {
    return this.apiKeymanager.updateTier(request);
  }
}
