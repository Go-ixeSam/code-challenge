import { PartialType } from '@nestjs/mapped-types';
import { CreateNetflixShowDto } from './create-netflix-show.dto';

export class UpdateNetflixShowDto extends PartialType(CreateNetflixShowDto) {}
