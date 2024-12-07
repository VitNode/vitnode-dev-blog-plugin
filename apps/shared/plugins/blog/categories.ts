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

  @ApiProperty({ type: [StringLanguage] })
  @ArrayMinSize(1)
  name: StringLanguage[];

  @ApiProperty()
  @IsString()
  color: string;
}

export class CategoryBlog {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty({ type: [StringLanguage] })
  name: StringLanguage[];

  @ApiProperty()
  color: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  position: number;
}

export class CategoriesBlogQuery extends PaginationQuery {}

export class CategoriesBlogObj extends PaginationObj {
  @ApiProperty({ type: [CategoryBlog] })
  edges: CategoryBlog[];
}
