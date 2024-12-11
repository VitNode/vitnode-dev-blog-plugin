import { Module } from '@nestjs/common';

import { CategoriesAdminBlogController } from './categories.controller';
import { CreateCategoriesAdminBlogService } from './services/create.service';
import { DeleteCategoriesAdminBlogService } from './services/delete.service';
import { EditCategoriesAdminBlogService } from './services/edit.service';

@Module({
  providers: [
    CreateCategoriesAdminBlogService,
    DeleteCategoriesAdminBlogService,
    EditCategoriesAdminBlogService,
  ],
  controllers: [CategoriesAdminBlogController],
})
export class CategoriesAdminBlogModule {}
