import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsString } from 'class-validator';
import { StringLanguage } from 'vitnode-shared/string-language.dto';
import {
  PaginationObj,
  PaginationQuery,
} from 'vitnode-shared/utils/pagination.dto';

export class CreateCategoriesAdminBlogBody {
  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty({ type: [StringLanguage] })
  @ArrayMinSize(1)
  name: StringLanguage[];

  @ApiProperty()
  @IsString()
  slug: string;
}

export class CategoryBlog {
  @ApiProperty()
  color: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  id: number;

  @ApiProperty({ type: [StringLanguage] })
  name: StringLanguage[];

  @ApiProperty()
  position: number;

  @ApiProperty()
  slug: string;
}

export class CategoriesBlogQuery extends PaginationQuery {}

export class CategoriesBlogObj extends PaginationObj {
  @ApiProperty({ type: [CategoryBlog] })
  edges: CategoryBlog[];
}
