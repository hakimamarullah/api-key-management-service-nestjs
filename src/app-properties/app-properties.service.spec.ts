import { Test, TestingModule } from '@nestjs/testing';
import { AppPropertiesService } from './app-properties.service';

describe('AppPropertiesService', () => {
  let service: AppPropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppPropertiesService],
    }).compile();

    service = module.get<AppPropertiesService>(AppPropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
