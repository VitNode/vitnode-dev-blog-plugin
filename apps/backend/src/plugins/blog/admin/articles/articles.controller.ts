import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  ArticlesAdminBlogObj,
  ArticlesBlog,
  ArticlesBlogQuery,
  CreateArticlesAdminBlogBody,
} from 'shared/blog/articles';
import { Controllers } from 'vitnode-backend/helpers/controller.decorator';
import { FilesValidationPipe } from 'vitnode-backend/helpers/files/files.pipe';
import { UploadFilesMethod } from 'vitnode-backend/helpers/upload-files.decorator';

import { CreateArticlesAdminBlogService } from './services/create.service';
import { DeleteArticlesAdminBlogService } from './services/delete.service';
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
  ) {}

  @ApiCreatedResponse({ type: ArticlesBlog, description: 'Created article' })
  @Post()
  @UploadFilesMethod({ fields: ['image'] })
  async createArticle(
    @UploadedFiles(
      new FilesValidationPipe({
        icon: {
          maxSize: 1024 * 1024 * 2, // 2 MB
          acceptMimeType: ['image/png', 'image/jpeg', 'image/webp'],
          isOptional: true,
          maxCount: 1,
        },
      }),
    )
    files: Pick<CreateArticlesAdminBlogBody, 'image'>,
    @Body() body: CreateArticlesAdminBlogBody,
  ): Promise<ArticlesBlog> {
    return await this.createService.create({ body, files });
  }

  @ApiOkResponse({ description: 'Delete article' })
  @Delete(':id')
  async deleteArticle(@Param('id') id: string): Promise<void> {
    await this.deleteService.delete(+id);
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
