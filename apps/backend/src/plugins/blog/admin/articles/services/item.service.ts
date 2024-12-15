import { DatabaseService } from '@/database/database.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesAdminBlog } from 'shared/blog/articles';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';
import { UserHelper } from 'vitnode-backend/helpers/user.service';

import { blog_articles } from '../../database/schema/articles';
import { blog_categories } from '../../database/schema/categories';

@Injectable()
export class ItemArticlesAdminBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
    private readonly userHelper: UserHelper,
  ) {}

  async item(id: number): Promise<ArticlesAdminBlog> {
    const article = await this.databaseService.db.query.blog_articles.findFirst(
      {
        where: (table, { eq }) => eq(table.id, id),
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

    const authors: ArticlesAdminBlog['authors'] = await Promise.all(
      article.authors.map(async author => {
        const user = await this.userHelper.getUserById({ id: author.user_id });

        if (!user) {
          throw new InternalServerErrorException();
        }

        return user;
      }),
    );

    return {
      ...article,
      category: {
        ...article.category,
        name: i18nCategory.filter(item => item.variable === 'name'),
      },
      title: i18n.filter(item => item.variable === 'title'),
      content: i18n.filter(item => item.variable === 'content'),
      authors,
    };
  }
}
