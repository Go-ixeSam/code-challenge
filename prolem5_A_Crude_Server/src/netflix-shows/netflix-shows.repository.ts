import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './common/base/base.repository';
import { CreateNetflixShowDto } from './dto/create-netflix-show.dto';
import { NetflixQueryDto } from './dto/pagination.dto';
import { UpdateNetflixShowDto } from './dto/update-netflix-show.dto';
import { NetflixShow } from './entities/netflix-show.entity';

@Injectable()
export class NetflixShowsRepository extends BaseRepository<NetflixShow> {
    constructor(dataSource: DataSource) {
        super(dataSource.getRepository(NetflixShow));
    }

    findAll(query: NetflixQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        return this.paginate({ page, limit, skip });
    }

    findOneById(id: string) {
        return this.repo.findOne({ where: { show_id: id } });
    }

    createShow(data: CreateNetflixShowDto | Partial<NetflixShow>) {
        const payload: Partial<NetflixShow> = {
            ...data,
            date_added: data.date_added ? new Date(data.date_added) : undefined,
        };

        const entity = this.repo.create(payload);
        return this.repo.save(entity);
    }

    updateShow(id: string, data: UpdateNetflixShowDto | Partial<NetflixShow>) {
        const payload: Partial<NetflixShow> = {
            ...data,
            date_added: data.date_added ? new Date(data.date_added) : undefined,
        };

        return this.repo.update({ show_id: id }, payload);
    }

    deleteShow(id: string) {
        return this.repo.delete({ show_id: id });
    }
}
