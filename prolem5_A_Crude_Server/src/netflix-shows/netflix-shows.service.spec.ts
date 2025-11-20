import { Test, TestingModule } from '@nestjs/testing';
import { NetflixShowsService } from './netflix-shows.service';

describe('NetflixShowsService', () => {
  let service: NetflixShowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetflixShowsService],
    }).compile();

    service = module.get<NetflixShowsService>(NetflixShowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
