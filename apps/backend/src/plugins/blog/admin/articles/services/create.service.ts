import { DatabaseService } from '@/database/database.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ArticlesBlog,
  CreateArticlesAdminBlogBody,
} from 'shared/blog/articles';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';
import { UserHelper } from 'vitnode-backend/helpers/user.service';

import {
  blog_articles,
  blog_articles_authors,
} from '../../database/schema/articles';
import { blog_categories } from '../../database/schema/categories';

@Injectable()
export class CreateArticlesAdminBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
    private readonly userHelper: UserHelper,
  ) {}

  async create({
    title,
    content,
    author_ids,
    slug,
    category_id,
    published_at,
  }: CreateArticlesAdminBlogBody): Promise<ArticlesBlog> {
    const category =
      await this.databaseService.db.query.blog_categories.findFirst({
        where: (table, { eq }) => eq(table.id, category_id),
      });

    if (!category) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    const findArticle =
      await this.databaseService.db.query.blog_articles.findFirst({
        where: (table, { eq, and }) =>
          and(eq(table.slug, slug), eq(table.category_id, category_id)),
        columns: {
          id: true,
        },
      });

    if (findArticle) {
      throw new BadRequestException('ARTICLE_ALREADY_EXISTS');
    }

    const findAuthors = await this.databaseService.db.query.core_users.findMany(
      {
        where: (table, { inArray }) => inArray(table.id, author_ids),
      },
    );

    author_ids.forEach(author_id => {
      if (!findAuthors.find(author => author.id === author_id)) {
        throw new BadRequestException('AUTHOR_NOT_FOUND');
      }
    });

    const [item] = await this.databaseService.db
      .insert(blog_articles)
      .values({
        slug,
        category_id,
        published_at,
      })
      .returning();

    const authorsFromDb = await this.databaseService.db
      .insert(blog_articles_authors)
      .values(
        author_ids.map(author_id => ({
          article_id: item.id,
          user_id: author_id,
        })),
      )
      .returning();

    const titleFromDb = await this.stringLanguageHelper.parse({
      item_id: item.id,
      plugin_code: 'blog',
      database: blog_articles,
      data: title,
      variable: 'title',
    });
    const contentFromDb = await this.stringLanguageHelper.parse({
      item_id: item.id,
      plugin_code: 'blog',
      database: blog_articles,
      data: content,
      variable: 'content',
    });
    const i18nCategory = await this.stringLanguageHelper.get({
      item_ids: [category_id],
      database: blog_categories,
      plugin_code: 'blog',
      variables: ['name'],
    });

    const authors: ArticlesBlog['authors'] = await Promise.all(
      authorsFromDb.map(async author => {
        const user = await this.userHelper.getUserById({ id: author.user_id });

        if (!user) {
          throw new InternalServerErrorException();
        }

        return user;
      }),
    );

    return {
      ...item,
      authors,
      title: titleFromDb,
      content: contentFromDb,
      category: {
        ...category,
        name: i18nCategory.filter(value => value.variable === 'name'),
      },
    };
  }
}
