import { DatabaseService } from '@/database/database.service';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  CategoryBlog,
  CreateCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';

import { blog_categories } from '../../database/schema/categories';

@Injectable()
export class CreateCategoriesAdminBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
  ) {}

  async create({
    name,
    code,
    color,
  }: CreateCategoriesAdminBlogBody): Promise<CategoryBlog> {
    const category =
      await this.databaseService.db.query.blog_categories.findFirst({
        where: (table, { eq }) => eq(table.code, code),
      });

    if (category) {
      throw new ConflictException('Category already exists');
    }

    const [item] = await this.databaseService.db
      .insert(blog_categories)
      .values({
        code,
        color,
      });

    const nameWithI18n = await this.stringLanguageHelper.parse({
      item_id: item.id,
      plugin_code: 'blog',
      database: blog_categories,
      data: name,
      variable: 'name',
    });

    return {
      ...item,
      name: nameWithI18n,
    };
  }
}
