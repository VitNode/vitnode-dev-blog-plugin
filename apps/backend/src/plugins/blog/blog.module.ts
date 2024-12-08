import { Module } from '@nestjs/common';

import { AdminBlogModule } from './admin/admin.module';
import { CategoriesBlogModule } from './categories/categories.module';

@Module({
  imports: [AdminBlogModule, CategoriesBlogModule],
})
export class BlogModule {}
