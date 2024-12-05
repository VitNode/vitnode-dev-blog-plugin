import { Module } from '@nestjs/common';

import { CategoriesAdminBlogModule } from './categories/categories.module';

@Module({
  imports: [CategoriesAdminBlogModule],
})
export class AdminBlogModule {}
