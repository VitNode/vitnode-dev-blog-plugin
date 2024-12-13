import { Module } from '@nestjs/common';

import { ArticlesAdminBlogController } from './articles.controller';
import { CreateArticlesAdminBlogService } from './services/create.service';
import { DeleteArticlesAdminBlogService } from './services/delete.service';
import { ShowArticlesAdminBlogService } from './services/show.service';

@Module({
  providers: [
    CreateArticlesAdminBlogService,
    ShowArticlesAdminBlogService,
    DeleteArticlesAdminBlogService,
  ],
  controllers: [ArticlesAdminBlogController],
})
export class ArticlesAdminBlogModule {}
