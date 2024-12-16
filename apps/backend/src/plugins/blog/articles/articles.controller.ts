import { Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  ArticlesBlog,
  ArticlesBlogObj,
  ArticlesBlogQuery,
} from 'shared/blog/articles';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';

import { ItemArticlesBlogService } from './service/item.service';
import { ShowArticlesBlogService } from './service/show.service';

@Controllers({
  plugin_name: 'Blog',
  plugin_code: 'blog',
  route: 'articles',
})
export class ArticlesBlogController {
  constructor(
    private readonly showService: ShowArticlesBlogService,
    private readonly itemService: ItemArticlesBlogService,
  ) {}

  @ApiOkResponse({ type: ArticlesBlog, description: 'Show article' })
  @Get(':category_slug/:slug')
  async showArticle(
    @Param('slug') slug: string,
    @Param('category_slug') category_slug: string,
  ): Promise<ArticlesBlog> {
    return await this.itemService.item({ slug, category_slug });
  }

  @ApiOkResponse({ type: ArticlesBlogObj, description: 'Show articles' })
  @Get()
  async showArticles(
    @Query() body: ArticlesBlogQuery,
  ): Promise<ArticlesBlogObj> {
    return await this.showService.show(body);
  }
}
