import { Module } from '@nestjs/common';

import { ArticlesAdminBlogController } from './articles.controller';
import { CreateArticlesAdminBlogService } from './services/create.service';

@Module({
  providers: [CreateArticlesAdminBlogService],
  controllers: [ArticlesAdminBlogController],
})
export class ArticlesAdminBlogModule {}
