import { Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CategoriesBlogObj, CategoriesBlogQuery } from 'shared/blog/categories';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';

import { ShowCategoriesBlogService } from './service/show.service';

@Controllers({
  plugin_name: 'Blog',
  plugin_code: 'blog',
  route: 'categories',
})
export class CategoriesBlogController {
  constructor(private readonly showService: ShowCategoriesBlogService) {}

  @ApiOkResponse({ type: CategoriesBlogObj, description: 'Show categories' })
  @Get()
  async showCategories(
    @Query() query: CategoriesBlogQuery,
  ): Promise<CategoriesBlogObj> {
    return await this.showService.show(query);
  }
}
