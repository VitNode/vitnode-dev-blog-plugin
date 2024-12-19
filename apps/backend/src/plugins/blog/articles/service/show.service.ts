import { DatabaseService } from '@/database/database.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';
import { UserHelper } from 'vitnode-backend/helpers/user.service';
import { SortDirectionEnum } from 'vitnode-shared/utils/pagination.enum';

import { blog_articles } from '../../admin/database/schema/articles';
import { blog_categories } from '../../admin/database/schema/categories';

@Injectable()
export class ShowArticlesBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
    private readonly userHelper: UserHelper,
  ) {}

  async show({
    cursor,
    first,
    last,
    category_slug,
  }: ArticlesBlogQuery): Promise<ArticlesBlogObj> {
    let categoryId: null | number = null;
    if (category_slug) {
      const category =
        await this.databaseService.db.query.blog_categories.findFirst({
          where: (table, { eq }) => eq(table.slug, category_slug),
          columns: {
            id: true,
          },
        });

      if (!category) {
        throw new NotFoundException();
      }

      categoryId = category.id;
    }

    const pagination = await this.databaseService.paginationCursor({
      cursor,
      database: blog_articles,
      first,
      last,
      defaultSortBy: {
        direction: SortDirectionEnum.desc,
        column: 'published_at',
      },
      query: async args =>
        await this.databaseService.db.query.blog_articles.findMany({
          ...args,
          where: (table, { and, lte, eq }) =>
            and(
              args.where,
              lte(table.published_at, new Date()),
              eq(table.is_draft, false),
              categoryId ? eq(table.category_id, categoryId) : undefined,
            ),
          with: {
            category: true,
            authors: true,
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

        const authors: ArticlesBlogObj['edges'][0]['authors'] =
          await Promise.all(
            edge.authors.map(async author => {
              const user = await this.userHelper.getUserById({
                id: author.user_id,
              });

              if (!user) {
                throw new InternalServerErrorException();
              }

              return user;
            }),
          );

        return {
          ...edge,
          authors,
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

    const categoriesEdges: ArticlesBlogObj['categories'] = await Promise.all(
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
