import { DatabaseService } from '@/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';

import { blog_articles } from '../../database/schema/articles';

@Injectable()
export class DeleteArticlesAdminBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
  ) {}

  async delete(id: number): Promise<void> {
    const article = await this.databaseService.db.query.blog_articles.findFirst(
      {
        where: (table, { eq }) => eq(table.id, id),
        columns: {
          id: true,
        },
      },
    );

    if (!article) {
      throw new NotFoundException();
    }

    await this.stringLanguageHelper.delete({
      plugin_code: 'blog',
      item_id: id,
      database: blog_articles,
    });

    await this.databaseService.db
      .delete(blog_articles)
      .where(eq(blog_articles.id, id));
  }
}
