import { DatabaseService } from '@/database/database.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesBlog } from 'shared/blog/articles';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';
import { UserHelper } from 'vitnode-backend/helpers/user.service';

import { blog_articles } from '../../admin/database/schema/articles';
import { blog_categories } from '../../admin/database/schema/categories';

@Injectable()
export class ItemArticlesBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
    private readonly userHelper: UserHelper,
  ) {}

  async item({
    slug,
    category_slug,
  }: {
    category_slug: string;
    slug: string;
  }): Promise<ArticlesBlog> {
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

    const article = await this.databaseService.db.query.blog_articles.findFirst(
      {
        where: (table, { eq, and }) =>
          and(eq(table.slug, slug), eq(table.category_id, category.id)),
        with: {
          category: true,
          authors: true,
        },
      },
    );
    if (!article) {
      throw new NotFoundException();
    }

    const i18n = await this.stringLanguageHelper.get({
      item_ids: [article.id],
      database: blog_articles,
      plugin_code: 'blog',
      variables: ['title', 'content'],
    });

    const i18nCategory = await this.stringLanguageHelper.get({
      item_ids: [article.category.id],
      database: blog_categories,
      plugin_code: 'blog',
      variables: ['name'],
    });

    const authors: ArticlesBlog['authors'] = await Promise.all(
      article.authors.map(async author => {
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
      ...article,
      authors,
      category: {
        ...article.category,
        name: i18nCategory.filter(item => item.variable === 'name'),
      },
      title: i18n.filter(item => item.variable === 'title'),
      content: i18n.filter(item => item.variable === 'content'),
    };
  }
}
