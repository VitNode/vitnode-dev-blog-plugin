import { DatabaseService } from '@/database/database.service';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  CategoryBlog,
  CreateCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { removeSpecialCharacters } from 'vitnode-backend/functions/special-characters';
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
    slug,
    color,
  }: CreateCategoriesAdminBlogBody): Promise<CategoryBlog> {
    const category =
      await this.databaseService.db.query.blog_categories.findFirst({
        where: (table, { eq }) => eq(table.slug, slug),
      });

    if (category) {
      throw new ConflictException('CATEGORY_ALREADY_EXISTS');
    }

    const getLastPosition =
      await this.databaseService.db.query.blog_categories.findFirst({
        orderBy: (table, { desc }) => desc(table.position),
      });

    const [item] = await this.databaseService.db
      .insert(blog_categories)
      .values({
        slug: removeSpecialCharacters(slug),
        color,
        position: getLastPosition ? getLastPosition.position + 1 : 0,
      })
      .returning();

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
