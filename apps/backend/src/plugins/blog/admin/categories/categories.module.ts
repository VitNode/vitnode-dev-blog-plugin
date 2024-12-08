import { Module } from '@nestjs/common';

import { CategoriesAdminBlogController } from './categories.controller';
import { CreateCategoriesAdminBlogService } from './services/create.service';
import { DeleteCategoriesAdminBlogService } from './services/delete.service';

@Module({
  providers: [
    CreateCategoriesAdminBlogService,
    DeleteCategoriesAdminBlogService,
  ],
  controllers: [CategoriesAdminBlogController],
})
export class CategoriesAdminBlogModule {}
