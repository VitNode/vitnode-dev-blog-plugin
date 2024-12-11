import { Body, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CategoryBlog,
  CreateCategoriesAdminBlogBody,
  EditCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';

import { CreateCategoriesAdminBlogService } from './services/create.service';
import { DeleteCategoriesAdminBlogService } from './services/delete.service';
import { EditCategoriesAdminBlogService } from './services/edit.service';

@Controllers({
  plugin_name: 'Blog',
  plugin_code: 'blog',
  route: 'categories',
  isAdmin: true,
})
export class CategoriesAdminBlogController {
  constructor(
    private readonly createService: CreateCategoriesAdminBlogService,
    private readonly deleteService: DeleteCategoriesAdminBlogService,
    private readonly editService: EditCategoriesAdminBlogService,
  ) {}

  @ApiCreatedResponse({ type: CategoryBlog, description: 'Created category' })
  @Post()
  async createCategories(
    @Body() body: CreateCategoriesAdminBlogBody,
  ): Promise<CategoryBlog> {
    return await this.createService.create(body);
  }

  @ApiOkResponse({ description: 'Deleted category' })
  @Delete(':id')
  async deleteCategories(@Param('id') id: string): Promise<void> {
    await this.deleteService.delete(+id);
  }

  @ApiOkResponse({ type: CategoryBlog, description: 'Edited category' })
  @Put(':id')
  async editCategories(
    @Param('id') id: string,
    @Body() body: EditCategoriesAdminBlogBody,
  ): Promise<CategoryBlog> {
    return await this.editService.edit({ id: +id, body });
  }
}
