import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StringLanguage } from 'vitnode-shared/string-language.dto';
import { User } from 'vitnode-shared/user.dto';
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
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(item => +item) : [+value],
  )
  author_ids: number[];

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => +value)
  category_id: number;

  @ApiProperty({ type: [StringLanguage] })
  @ArrayMinSize(1)
  @Transform(({ value }: { value: string }) => {
    const current = JSON.parse(value);

    return Array.isArray(current) ? current : [current];
  })
  content: StringLanguage[];

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image: Express.Multer.File;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  published_at?: Date;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ type: [StringLanguage] })
  @ArrayMinSize(1)
  @Transform(({ value }: { value: string }) => {
    const current = JSON.parse(value);

    return Array.isArray(current) ? current : [current];
  })
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

export class ArticlesAdminBlog extends ArticlesBlog {
  @ApiProperty({ type: [User] })
  authors: User[];

  @ApiProperty()
  is_draft: boolean;

  @ApiProperty()
  published_at: Date;
}

export class ArticlesBlogQuery extends PaginationQuery {}

export class ArticlesBlogObj extends PaginationObj {
  @ApiProperty({ type: [CategoryBlog] })
  categories: CategoryBlog[];

  @ApiProperty({ type: [ArticlesBlog] })
  edges: ArticlesBlog[];
}

export class ArticlesAdminBlogObj extends PaginationObj {
  @ApiProperty({ type: [CategoryBlog] })
  categories: CategoryBlog[];

  @ApiProperty({ type: [ArticlesAdminBlog] })
  edges: ArticlesAdminBlog[];
}
