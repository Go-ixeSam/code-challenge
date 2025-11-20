import { Module } from '@nestjs/common';
import { NetflixShowsController } from './netflix-shows.controller';
import { NetflixShowsRepository } from './netflix-shows.repository';
import { NetflixShowsService } from './netflix-shows.service';

@Module({
  controllers: [NetflixShowsController],
  providers: [NetflixShowsService,NetflixShowsRepository,],
})
export class NetflixShowsModule {}
