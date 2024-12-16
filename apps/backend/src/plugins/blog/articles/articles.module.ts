import { Module } from '@nestjs/common';

import { ArticlesBlogController } from './articles.controller';
import { ItemArticlesBlogService } from './service/item.service';
import { ShowArticlesBlogService } from './service/show.service';

@Module({
  providers: [ShowArticlesBlogService, ItemArticlesBlogService],
  controllers: [ArticlesBlogController],
})
export class ArticlesBlogModule {}
