import { DatabaseService } from '@/database/database.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoriesAdminBlogBody } from 'shared/blog/categories';

@Injectable()
export class CreateCategoriesAdminBlogService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create({ title, code }: CreateCategoriesAdminBlogBody) {
    const category =
      await this.databaseService.db.query.blog_categories.findFirst({
        where: (table, { eq }) => eq(table.code, code),
      });

    if (category) {
      throw new ConflictException('Category already exists');
    }

    return `Hello World! - ${title[0].value}`;
  }
}
