import { Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ArticlesBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';

import { ShowArticlesBlogService } from './service/show.service';

@Controllers({
  plugin_name: 'Blog',
  plugin_code: 'blog',
  route: 'articles',
})
export class ArticlesBlogController {
  constructor(private readonly showService: ShowArticlesBlogService) {}

  @ApiOkResponse({ type: ArticlesBlogObj, description: 'Show articles' })
  @Get()
  async showArticles(
    @Query() body: ArticlesBlogQuery,
  ): Promise<ArticlesBlogObj> {
    return await this.showService.show(body);
  }
}
