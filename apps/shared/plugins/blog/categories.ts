import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize } from 'class-validator';
import { StringLanguage } from 'vitnode-shared/string-language.dto';

export class CreateCategoriesAdminBlogBody {
  @ApiProperty()
  code: string;

  @ApiProperty({ type: [StringLanguage] })
  @ArrayMinSize(1)
  title: StringLanguage[];
}
