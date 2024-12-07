import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CategoriesBlogObj,
  CategoriesBlogQuery,
  CategoryBlog,
  CreateCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';

import { CreateCategoriesAdminBlogService } from './services/create.service';
import { ShowCategoriesAdminBlogService } from './services/show.service';

@Controllers({
  plugin_name: 'Blog',
  plugin_code: 'blog',
  route: 'categories',
  isAdmin: true,
})
export class CategoriesAdminBlogController {
  constructor(
    private readonly createService: CreateCategoriesAdminBlogService,
    private readonly showService: ShowCategoriesAdminBlogService,
  ) {}

  @ApiCreatedResponse({ type: CategoryBlog, description: 'Created category' })
  @Post()
  async createCategories(
    @Body() body: CreateCategoriesAdminBlogBody,
  ): Promise<CategoryBlog> {
    return await this.createService.create(body);
  }

  @ApiOkResponse({ type: CategoriesBlogObj, description: 'Show categories' })
  @Get()
  async showCategories(
    @Query() body: CategoriesBlogQuery,
  ): Promise<CategoriesBlogObj> {
    return await this.showService.show(body);
  }
}
