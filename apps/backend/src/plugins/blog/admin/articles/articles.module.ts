import { Module } from '@nestjs/common';

import { ArticlesAdminBlogController } from './articles.controller';
import { CreateArticlesAdminBlogService } from './services/create.service';
import { DeleteArticlesAdminBlogService } from './services/delete.service';
import { EditArticlesAdminBlogService } from './services/edit.service';
import { ItemArticlesAdminBlogService } from './services/item.service';
import { ShowArticlesAdminBlogService } from './services/show.service';

@Module({
  providers: [
    CreateArticlesAdminBlogService,
    ShowArticlesAdminBlogService,
    DeleteArticlesAdminBlogService,
    ItemArticlesAdminBlogService,
    EditArticlesAdminBlogService,
  ],
  controllers: [ArticlesAdminBlogController],
})
export class ArticlesAdminBlogModule {}
