import { Body, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import {
  ArticlesBlog,
  CreateArticlesAdminBlogBody,
} from 'shared/blog/articles';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';

import { CreateArticlesAdminBlogService } from './services/create.service';

@Controllers({
  plugin_name: 'Blog',
  plugin_code: 'blog',
  route: 'articles',
  isAdmin: true,
})
export class ArticlesAdminBlogController {
  constructor(private readonly createService: CreateArticlesAdminBlogService) {}

  @ApiCreatedResponse({ type: ArticlesBlog, description: 'Created article' })
  @Post()
  async createArticle(
    @Body() body: CreateArticlesAdminBlogBody,
  ): Promise<ArticlesBlog> {
    return await this.createService.create(body);
  }
}
