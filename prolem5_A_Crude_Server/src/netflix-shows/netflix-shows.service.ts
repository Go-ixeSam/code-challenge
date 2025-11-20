import { Injectable } from '@nestjs/common';
import { BaseService } from './common/base/base.service';
import { NetflixShow } from './entities/netflix-show.entity';
import { NetflixShowsRepository } from './netflix-shows.repository';
import { NetflixQueryDto } from './dto/pagination.dto';

@Injectable()
export class NetflixShowsService extends BaseService<
  NetflixShow,
  'show_id'
> {
  constructor(repo: NetflixShowsRepository) {
    super(repo, 'show_id');
  }

  async findAll(query: NetflixQueryDto) {
  return this.repo.paginateWithFilters(query);
}
}