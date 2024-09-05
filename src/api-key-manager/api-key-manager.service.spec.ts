import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyManagerService } from './api-key-manager.service';

describe('ApiKeyManagerService', () => {
  let service: ApiKeyManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiKeyManagerService],
    }).compile();

    service = module.get<ApiKeyManagerService>(ApiKeyManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
