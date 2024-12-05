import { Body, Post } from '@nestjs/common';
import { CreateCategoriesAdminBlogBody } from 'shared/blog/categories';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';

import { CreateCategoriesAdminBlogService } from './services/create.service';

@Controllers({
  plugin_name: 'Blog',
  plugin_code: 'blog',
  route: 'categories',
  isAdmin: true,
})
export class CategoriesAdminBlogController {
  constructor(
    private readonly createService: CreateCategoriesAdminBlogService,
  ) {}

  @Post()
  async createCategories(@Body() body: CreateCategoriesAdminBlogBody) {
    return await this.createService.create(body);
  }
}
