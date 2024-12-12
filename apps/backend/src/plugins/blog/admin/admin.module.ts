import { Module } from '@nestjs/common';

import { ArticlesAdminBlogModule } from './articles/articles.module';
import { CategoriesAdminBlogModule } from './categories/categories.module';

@Module({
  imports: [CategoriesAdminBlogModule, ArticlesAdminBlogModule],
})
export class AdminBlogModule {}
