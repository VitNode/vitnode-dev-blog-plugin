import { DatabaseService } from '@/database/database.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  CategoryBlog,
  EditCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';

import { blog_categories } from '../../database/schema/categories';

@Injectable()
export class EditCategoriesAdminBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
  ) {}

  async edit({
    id,
    body: { name, slug, color, position },
  }: {
    body: EditCategoriesAdminBlogBody;
    id: number;
  }): Promise<CategoryBlog> {
    const items = await this.databaseService.db.query.blog_categories.findMany({
      orderBy: (table, { asc }) => asc(table.position),
    });
    const item = items.find(item => item.id === id);
    if (!item) {
      throw new NotFoundException();
    }
    const itemsWithoutCurrent = items.filter(item => item.id !== id);
    if (itemsWithoutCurrent.find(item => item.slug === slug)) {
      throw new ConflictException('CATEGORY_ALREADY_EXISTS');
    }

    // Update positions
    let count = 0;
    await Promise.all(
      itemsWithoutCurrent.map(async item => {
        if (count === position) {
          count++;
        }

        await this.databaseService.db
          .update(blog_categories)
          .set({
            position: count++,
          })
          .where(eq(blog_categories.id, item.id));
      }),
    );

    const [updatedItem] = await this.databaseService.db
      .update(blog_categories)
      .set({
        color,
        position,
        slug,
      })
      .where(eq(blog_categories.id, id))
      .returning();

    const nameWithI18n = await this.stringLanguageHelper.parse({
      item_id: updatedItem.id,
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
