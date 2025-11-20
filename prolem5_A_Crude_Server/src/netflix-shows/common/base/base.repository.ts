import { DeepPartial } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { PaginationOptions } from '../interfaces/pagination-options.interface';

export abstract class BaseRepository<T extends Record<string, any>> {
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
      page: Number(page) || 1,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    };
  }

  protected abstract applyFilters(qb: any, filters: any): void;

  async paginateWithFilters(filters: any) {
    const page = Number(filters.page ?? 1);
    const limit = Number(filters.limit ?? 10);
    const skip = (page - 1) * limit;

    let qb = this.repo.createQueryBuilder('n');
    this.applyFilters(qb, filters);

    const [data, total] = await qb
      .skip(skip)
      .take(limit)
      .orderBy('n.show_id', 'ASC')
      .getManyAndCount();

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
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
