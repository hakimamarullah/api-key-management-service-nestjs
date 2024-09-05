import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyManagerController } from './api-key-manager.controller';

describe('ApiKeyManagerController', () => {
  let controller: ApiKeyManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyManagerController],
    }).compile();

    controller = module.get<ApiKeyManagerController>(ApiKeyManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
