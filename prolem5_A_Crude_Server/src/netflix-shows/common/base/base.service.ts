import { NetflixQueryDto } from '../../dto/pagination.dto';
import { BaseRepository } from "./base.repository";
import { NotFoundException } from "@nestjs/common";

export class BaseService<
  TEntity extends Record<string, any>, 
  TIdField extends keyof TEntity
> {
  constructor(
    protected readonly repo: BaseRepository<TEntity>,
    private readonly idField: TIdField,
  ) {}

  async findAll(query: NetflixQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    return this.repo.paginate({ page, limit, skip });
  }

  async findOne(id: TEntity[TIdField]) {
    const data = await this.repo.findById(this.idField as any, id);
    if (!data) throw new NotFoundException('Resource not found');
    return data;
  }

  async create(data: any) {
    const entity = this.repo.createEntity(data as any);
    return this.repo.save(entity as any);
  }

  async update(id: TEntity[TIdField], data: any) {
    await this.findOne(id);
    await this.repo.updateById(this.idField, id, data as any);
    return this.findOne(id);
  }

  async remove(id: TEntity[TIdField]) {
    await this.findOne(id);
    return this.repo.deleteById(this.idField, id);
  }
}
