// src/articles/dto/search-articles.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class SearchArticlesDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  propertyType?: string;
}
