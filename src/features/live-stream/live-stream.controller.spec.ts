import { Test, TestingModule } from '@nestjs/testing';
import { LiveStreamController } from './live-stream.controller';
import { LiveStreamService } from './live-stream.service';

describe('LiveStreamController', () => {
  let controller: LiveStreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveStreamController],
      providers: [LiveStreamService],
    }).compile();

    controller = module.get<LiveStreamController>(LiveStreamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
