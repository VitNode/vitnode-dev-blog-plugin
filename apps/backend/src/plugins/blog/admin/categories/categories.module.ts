import { Module } from '@nestjs/common';

import { CategoriesAdminBlogController } from './categories.controller';
import { CreateCategoriesAdminBlogService } from './services/create.service';

@Module({
  providers: [CreateCategoriesAdminBlogService],
  controllers: [CategoriesAdminBlogController],
})
export class CategoriesAdminBlogModule {}
