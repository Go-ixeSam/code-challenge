import { Test, TestingModule } from '@nestjs/testing';
import { NetflixShowsController } from './netflix-shows.controller';
import { NetflixShowsService } from './netflix-shows.service';

describe('NetflixShowsController', () => {
  let controller: NetflixShowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetflixShowsController],
      providers: [NetflixShowsService],
    }).compile();

    controller = module.get<NetflixShowsController>(NetflixShowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
