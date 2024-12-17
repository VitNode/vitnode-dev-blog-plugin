import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  ArticlesAdminBlogObj,
  ArticlesBlog,
  ArticlesBlogQuery,
  CreateArticlesAdminBlogBody,
} from 'shared/blog/articles';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';

import { CreateArticlesAdminBlogService } from './services/create.service';
import { DeleteArticlesAdminBlogService } from './services/delete.service';
import { EditArticlesAdminBlogService } from './services/edit.service';
import { ItemArticlesAdminBlogService } from './services/item.service';
import { ShowArticlesAdminBlogService } from './services/show.service';

@Controllers({
  plugin_name: 'Blog',
  plugin_code: 'blog',
  route: 'articles',
  isAdmin: true,
})
export class ArticlesAdminBlogController {
  constructor(
    private readonly createService: CreateArticlesAdminBlogService,
    private readonly showService: ShowArticlesAdminBlogService,
    private readonly deleteService: DeleteArticlesAdminBlogService,
    private readonly itemService: ItemArticlesAdminBlogService,
    private readonly editService: EditArticlesAdminBlogService,
  ) {}

  @ApiCreatedResponse({ type: ArticlesBlog, description: 'Created article' })
  @Post()
  async createArticle(
    @Body() body: CreateArticlesAdminBlogBody,
  ): Promise<ArticlesBlog> {
    return await this.createService.create(body);
  }

  @ApiOkResponse({ description: 'Delete article' })
  @Delete(':id')
  async deleteArticle(@Param('id') id: string): Promise<void> {
    await this.deleteService.delete(+id);
  }

  @ApiOkResponse({ type: ArticlesBlog, description: 'Edit article' })
  @Put(':id')
  async editArticle(
    @Param('id') id: string,
    @Body() body: CreateArticlesAdminBlogBody,
  ): Promise<ArticlesBlog> {
    return await this.editService.edit({ id: +id, body });
  }

  @ApiOkResponse({ type: ArticlesBlog, description: 'Show article' })
  @Get(':id')
  async itemArticle(@Param('id') id: string): Promise<ArticlesBlog> {
    return await this.itemService.item(+id);
  }

  @ApiOkResponse({
    type: ArticlesAdminBlogObj,
    description: 'Show articles for admin',
  })
  @Get()
  async showArticles(
    @Query() body: ArticlesBlogQuery,
  ): Promise<ArticlesAdminBlogObj> {
    return await this.showService.show(body);
  }
}
