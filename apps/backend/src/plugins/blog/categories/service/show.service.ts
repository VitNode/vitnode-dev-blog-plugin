import { DatabaseService } from '@/database/database.service';
import { Injectable } from '@nestjs/common';
import { CategoriesBlogObj, CategoriesBlogQuery } from 'shared/blog/categories';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';
import { SortDirectionEnum } from 'vitnode-shared/utils/pagination.enum';

import { blog_categories } from '../../admin/database/schema/categories';

@Injectable()
export class ShowCategoriesBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
  ) {}

  async show({
    cursor,
    first,
    last,
  }: CategoriesBlogQuery): Promise<CategoriesBlogObj> {
    const pagination = await this.databaseService.paginationCursor({
      cursor,
      database: blog_categories,
      first,
      last,
      defaultSortBy: {
        direction: SortDirectionEnum.desc,
        column: 'position',
      },
      query: async args =>
        await this.databaseService.db.query.blog_categories.findMany({
          ...args,
        }),
    });

    const ids = pagination.edges.map(edge => edge.id);
    const i18n = await this.stringLanguageHelper.get({
      item_ids: ids,
      database: blog_categories,
      plugin_code: 'blog',
      variables: ['name'],
    });

    const edges: CategoriesBlogObj['edges'] = pagination.edges.map(edge => {
      const currentI18n = i18n.filter(item => item.item_id === edge.id);

      return {
        ...edge,
        name: currentI18n
          .filter(value => value.variable === 'name')
          .map(value => ({
            value: value.value,
            language_code: value.language_code,
          })),
      };
    });

    return {
      ...pagination,
      edges,
    };
  }
}
