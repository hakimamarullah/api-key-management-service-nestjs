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
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyResponseDto } from './dto/response/api-key-response.dto';
import { ApiKeyManagerService } from './api-key-manager.service';
import { RotateApiKeyDto } from './dto/rotate-api-key.dto';
import { ApiKeyTierDto } from './dto/api-key-tier.dto';
import { GenerateKeyRequest } from './dto/request/generateKey.request';
import { ValidateKeyResponse } from './dto/response/validateKey.response';
import { CreateTierRequest } from './dto/request/createTier.request';
import { UpdateTierRequest } from './dto/request/updateTier.request';
import { UpdateKeyRequest } from './dto/request/updateKey.request';
import {
  ApiBaseResponse,
  ApiParamId,
  getUsername,
  Public,
} from '@hakimamarullah/commonbundle-nestjs';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('ApiKeyManager Controller')
@Controller('api-key-manager')
export class ApiKeyManagerController {
  constructor(private apiKeyManager: ApiKeyManagerService) {}
  @Post('generate')
  @ApiOperation({ summary: 'Create new API Key with the given tier and owner' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyResponseDto })
  @ApiBody({ type: GenerateKeyRequest })
  async generateApiKey(@Body() request: GenerateKeyRequest) {
    return this.apiKeyManager.generateApiKey(request);
  }

  @Get('tiers')
  @Public()
  @ApiOperation({ summary: 'List available tiers' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyTierDto, isArray: true })
  async getAvailableTiers() {
    return this.apiKeyManager.getAvailableTiers();
  }

  @Post('rotate')
  @ApiOperation({ summary: 'Rotate API Key' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyResponseDto })
  @ApiBody({ type: RotateApiKeyDto })
  async rotateApiKey(@Body() apiKey: RotateApiKeyDto) {
    return this.apiKeyManager.rotateKey(apiKey);
  }

  @Get('validate/:apiKey')
  @ApiOperation({ summary: 'Validate API Key' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ValidateKeyResponse })
  async validateApiKey(@Param('apiKey') apiKey: string) {
    return this.apiKeyManager.validateApiKey(apiKey);
  }

  @Post('tiers')
  @ApiOperation({ summary: 'Create API Tier' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBaseResponse({ model: ApiKeyTierDto })
  @ApiBody({ type: CreateTierRequest })
  async createTier(@Body() request: CreateTierRequest) {
    return this.apiKeyManager.createTier(request);
  }

  @Delete('tiers/:tierId')
  @ApiOperation({ summary: 'Delete API Tier By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: Object })
  @ApiParamId({ name: 'tierId' })
  async deleteTier(@Param('tierId', ParseIntPipe) tierId: number) {
    return this.apiKeyManager.deleteTier(tierId);
  }

  @Put('tiers')
  @ApiOperation({ summary: 'Update API Tier' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: Object })
  @ApiBody({ type: UpdateTierRequest })
  async updateTier(@Body() request: UpdateTierRequest) {
    return this.apiKeyManager.updateTier(request);
  }

  @Get('tiers/:tierId/details')
  @Public()
  @ApiOperation({ summary: 'Get API Tier By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyTierDto })
  @ApiParamId({ name: 'tierId' })
  async getTierById(@Param('tierId', ParseIntPipe) tierId: number) {
    return this.apiKeyManager.getTierById(tierId);
  }

  @Put('api-keys/status')
  @ApiOperation({ summary: 'Update API Key Status' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: Object })
  @ApiBody({ type: UpdateKeyRequest })
  async updateApiKeyStatus(@Body() request: UpdateKeyRequest) {
    return await this.apiKeyManager.updateApiKeyStatus(request);
  }

  @Get('api-keys/:username/active')
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyResponseDto, isArray: true })
  @ApiParam({ name: 'username' })
  async getApiKeysByUsername(@Param('username') username: string) {
    return await this.apiKeyManager.getActiveApiKeysByUsername(username);
  }

  @Get('api-keys/active/me')
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyResponseDto, isArray: true })
  async getApiKeysMe(@Req() req: Request) {
    const username = getUsername(req);
    return await this.apiKeyManager.getActiveApiKeysByUsername(username);
  }
}
