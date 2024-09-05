import { Test, TestingModule } from '@nestjs/testing';
import { JwtConfigService } from './jwt-config.service';

describe('JwtConfigService', () => {
  let service: JwtConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtConfigService],
    }).compile();

    service = module.get<JwtConfigService>(JwtConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
