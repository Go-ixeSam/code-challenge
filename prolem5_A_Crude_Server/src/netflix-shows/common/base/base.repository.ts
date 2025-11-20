import { DeepPartial } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { PaginationOptions } from '../interfaces/pagination-options.interface';

export class BaseRepository<T extends Record<string, any>> {
  constructor(protected readonly repo: Repository<T>) { }

  async paginate(options: PaginationOptions) {
    const { skip = 0, limit = 10, page = 1 } = options;

    // ensure limit positive
    const take = Math.max(1, Number(limit || 10));
    const realSkip = Math.max(0, Number(skip || (Number(page || 1) - 1) * take));

    const [data, total] = await this.repo.findAndCount({
      skip: realSkip,
      take,
    });

    return {
      data,
      meta: {
        page: Number(page) || 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  buildWhereQuery(qb, filters: Record<string, any>) {
    const { search, type, country, release_year } = filters;

    if (search) {
      qb.andWhere(`
        (n.title ILIKE :search
        OR n.director ILIKE :search
        OR n.cast_members ILIKE :search
        OR n.description ILIKE :search)
      `, { search: `%${search}%` });
    }

    if (type) qb.andWhere('n.type = :type', { type });
    if (country) qb.andWhere('n.country = :country', { country });
    if (release_year) qb.andWhere('n.release_year = :release_year', { release_year });

    return qb;
  }

  async paginateWithFilters(filters: any) {
    const page = Number(filters.page ?? 1);
    const limit = Number(filters.limit ?? 10);
    const skip = (page - 1) * limit;

    let qb = this.repo.createQueryBuilder('n');

    qb = this.buildWhereQuery(qb, filters);

    const [data, total] = await qb
      .skip(skip)
      .take(limit)
      .orderBy('n.show_id', 'ASC')
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findById(idField: keyof T, id: any) {
    return this.repo.findOne({
      where: { [idField]: id } as any,
    });
  }

  createEntity(data: DeepPartial<T>) {
    return this.repo.create(data);
  }

  save(entity: DeepPartial<T>) {
    return this.repo.save(entity);
  }

  update(criteria: any, data: DeepPartial<T>) {
    return this.repo.update(criteria, data as any);
  }

  updateById(idField: keyof T, id: any, data: DeepPartial<T>) {
    return this.repo.update({ [idField]: id } as any, data as any);
  }

  deleteById(idField: keyof T, id: any) {
    return this.repo.delete({ [idField]: id } as any);
  }
}
