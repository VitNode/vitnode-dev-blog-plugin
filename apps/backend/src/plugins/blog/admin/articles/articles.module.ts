import { Module } from '@nestjs/common';

import { ArticlesAdminBlogController } from './articles.controller';
import { CreateArticlesAdminBlogService } from './services/create.service';
import { ShowArticlesAdminBlogService } from './services/show.service';

@Module({
  providers: [CreateArticlesAdminBlogService, ShowArticlesAdminBlogService],
  controllers: [ArticlesAdminBlogController],
})
export class ArticlesAdminBlogModule {}
