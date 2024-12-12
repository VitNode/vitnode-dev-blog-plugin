import { DatabaseService } from '@/database/database.service';
import { Injectable } from '@nestjs/common';
import { ArticlesAdminBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';
import { SortDirectionEnum } from 'vitnode-shared/utils/pagination.enum';

import { blog_articles } from '../../database/schema/articles';
import { blog_categories } from '../../database/schema/categories';

@Injectable()
export class ShowArticlesAdminBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
  ) {}

  async show({
    cursor,
    first,
    last,
  }: ArticlesBlogQuery): Promise<ArticlesAdminBlogObj> {
    const pagination = await this.databaseService.paginationCursor({
      cursor,
      database: blog_articles,
      first,
      last,
      defaultSortBy: {
        direction: SortDirectionEnum.asc,
        column: 'created_at',
      },
      query: async args =>
        await this.databaseService.db.query.blog_articles.findMany({
          ...args,
          with: {
            category: true,
          },
        }),
    });

    const ids = pagination.edges.map(edge => edge.id);
    const i18n = await this.stringLanguageHelper.get({
      item_ids: ids,
      database: blog_articles,
      plugin_code: 'blog',
      variables: ['title', 'content'],
    });

    const edges: ArticlesAdminBlogObj['edges'] = await Promise.all(
      pagination.edges.map(async edge => {
        const currentI18n = i18n.filter(item => item.item_id === edge.id);

        const i18nCategory = await this.stringLanguageHelper.get({
          item_ids: [edge.category.id],
          database: blog_categories,
          plugin_code: 'blog',
          variables: ['name'],
        });

        return {
          ...edge,
          title: currentI18n
            .filter(value => value.variable === 'title')
            .map(value => ({
              value: value.value,
              language_code: value.language_code,
            })),
          content: currentI18n
            .filter(value => value.variable === 'content')
            .map(value => ({
              value: value.value,
              language_code: value.language_code,
            })),
          category: {
            ...edge.category,
            name: i18nCategory.filter(value => value.variable === 'name'),
          },
        };
      }),
    );

    const categories =
      await this.databaseService.db.query.blog_categories.findMany({
        orderBy: (table, { asc }) => asc(table.position),
      });

    const categoriesEdges: ArticlesAdminBlogObj['categories'] =
      await Promise.all(
        categories.map(async category => {
          const i18n = await this.stringLanguageHelper.get({
            item_ids: [category.id],
            database: blog_categories,
            plugin_code: 'blog',
            variables: ['name'],
          });

          return {
            ...category,
            name: i18n.filter(value => value.variable === 'name'),
          };
        }),
      );

    return {
      ...pagination,
      edges,
      categories: categoriesEdges,
    };
  }
}
