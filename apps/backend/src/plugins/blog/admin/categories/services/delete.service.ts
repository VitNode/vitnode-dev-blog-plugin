import { DatabaseService } from '@/database/database.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';

import { blog_categories } from '../../database/schema/categories';

@Injectable()
export class DeleteCategoriesAdminBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
  ) {}

  async delete(id: number): Promise<void> {
    const category =
      await this.databaseService.db.query.blog_categories.findFirst({
        where: (table, { eq }) => eq(table.id, id),
      });

    if (!category) {
      throw new ConflictException('Category not found');
    }

    await this.stringLanguageHelper.delete({
      plugin_code: 'blog',
      item_id: id,
      database: blog_categories,
    });

    await this.databaseService.db
      .delete(blog_categories)
      .where(eq(blog_categories.id, id));
  }
}
