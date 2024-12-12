import { Module } from '@nestjs/common';

import { ArticlesBlogController } from './articles.controller';
import { ShowArticlesBlogService } from './service/show.service';

@Module({
  providers: [ShowArticlesBlogService],
  controllers: [ArticlesBlogController],
})
export class ArticlesBlogModule {}
