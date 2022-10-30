import { Test, TestingModule } from '@nestjs/testing';
import { CouncilorController } from './councilor.controller';

describe('CouncilorController', () => {
  let controller: CouncilorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouncilorController],
    }).compile();

    controller = module.get<CouncilorController>(CouncilorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
