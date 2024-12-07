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
  code: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty({ type: [StringLanguage] })
  @ArrayMinSize(1)
  name: StringLanguage[];
}

export class CategoryBlog {
  @ApiProperty()
  code: string;

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
}

export class CategoriesBlogQuery extends PaginationQuery {}

export class CategoriesBlogObj extends PaginationObj {
  @ApiProperty({ type: [CategoryBlog] })
  edges: CategoryBlog[];
}
