import { Test, TestingModule } from '@nestjs/testing';
import { LiveStreamService } from './live-stream.service';

describe('LiveStreamService', () => {
  let service: LiveStreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveStreamService],
    }).compile();

    service = module.get<LiveStreamService>(LiveStreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
