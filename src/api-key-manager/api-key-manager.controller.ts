import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('ApiKeyManager Controller')
@Controller('api-key-manager')
export class ApiKeyManagerController {
  @Get()
  async hello() {
    return 'Hello World!';
  }
}
