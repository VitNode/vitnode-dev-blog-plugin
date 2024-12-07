import { Module } from '@nestjs/common';

import { CategoriesAdminBlogController } from './categories.controller';
import { CreateCategoriesAdminBlogService } from './services/create.service';
import { ShowCategoriesAdminBlogService } from './services/show.service';

@Module({
  providers: [CreateCategoriesAdminBlogService, ShowCategoriesAdminBlogService],
  controllers: [CategoriesAdminBlogController],
})
export class CategoriesAdminBlogModule {}
