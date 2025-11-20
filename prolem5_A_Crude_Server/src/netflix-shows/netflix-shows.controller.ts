import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { NetflixShowsService } from './netflix-shows.service';
import { CreateNetflixShowDto } from './dto/create-netflix-show.dto';
import { UpdateNetflixShowDto } from './dto/update-netflix-show.dto';
import { NetflixQueryDto } from './dto/pagination.dto';

@Controller('netflix-shows')
export class NetflixShowsController {
  constructor(private readonly service: NetflixShowsService) {}

  @Get()
  findAll(@Query() pagination: NetflixQueryDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNetflixShowDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNetflixShowDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
