import { DatabaseService } from '@/database/database.service';
import { Injectable } from '@nestjs/common';
import { ArticlesBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';
import { SortDirectionEnum } from 'vitnode-shared/utils/pagination.enum';

import { blog_articles } from '../../admin/database/schema/articles';
import { blog_categories } from '../../admin/database/schema/categories';

@Injectable()
export class ShowArticlesBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
  ) {}

  async show({
    cursor,
    first,
    last,
  }: ArticlesBlogQuery): Promise<ArticlesBlogObj> {
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
          where: (table, { and, gte, eq }) =>
            and(
              args.where,
              gte(table.published_at, new Date()),
              eq(table.is_draft, false),
            ),
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

    const edges: ArticlesBlogObj['edges'] = await Promise.all(
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

    return {
      ...pagination,
      edges,
    };
  }
}
