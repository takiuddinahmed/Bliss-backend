import { Test, TestingModule } from '@nestjs/testing';
import { CouncilorService } from './councilor.service';

describe('CouncilorService', () => {
  let service: CouncilorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouncilorService],
    }).compile();

    service = module.get<CouncilorService>(CouncilorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
