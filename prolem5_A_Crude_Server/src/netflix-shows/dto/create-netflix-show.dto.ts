import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';

export class CreateNetflixShowDto {
  @IsString()
  show_id: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  cast_members?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  date_added?: string;

  @IsOptional()
  @IsInt()
  release_year?: number;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  listed_in?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
