import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StringLanguage } from 'vitnode-shared/string-language.dto';
import {
  PaginationObj,
  PaginationQuery,
} from 'vitnode-shared/utils/pagination.dto';

import { CategoryBlog } from './categories';

export class CreateArticlesAdminBlogBody {
  @ApiProperty()
  @ArrayMinSize(1)
  @IsArray()
  @IsNumber({}, { each: true })
  author_ids: number[];

  @ApiProperty()
  @IsNumber()
  category_id: number;

  @ApiProperty({ type: [StringLanguage] })
  @ArrayMinSize(1)
  content: StringLanguage[];

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  published_at?: Date;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ type: [StringLanguage] })
  @ArrayMinSize(1)
  title: StringLanguage[];
}

export class ArticlesBlog {
  @ApiProperty()
  category: CategoryBlog;

  @ApiProperty({ type: [StringLanguage] })
  content: StringLanguage[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  edited_at: Date;

  @ApiProperty()
  id: number;

  @ApiProperty()
  slug: string;

  @ApiProperty({ type: [StringLanguage] })
  title: StringLanguage[];
}

export class ArticlesBlogQuery extends PaginationQuery {}

export class ArticlesBlogObj extends PaginationObj {
  @ApiProperty({ type: [ArticlesBlog] })
  edges: ArticlesBlog[];
}
