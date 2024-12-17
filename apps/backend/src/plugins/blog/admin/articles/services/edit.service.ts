import { DatabaseService } from '@/database/database.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import {
  ArticlesBlog,
  CreateArticlesAdminBlogBody,
} from 'shared/blog/articles';
import { removeSpecialCharacters } from 'vitnode-backend/functions/special-characters';
import { StringLanguageHelper } from 'vitnode-backend/helpers/string_language/helpers.service';
import { UserHelper } from 'vitnode-backend/helpers/user.service';

import {
  blog_articles,
  blog_articles_authors,
} from '../../database/schema/articles';
import { blog_categories } from '../../database/schema/categories';

@Injectable()
export class EditArticlesAdminBlogService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stringLanguageHelper: StringLanguageHelper,
    private readonly userHelper: UserHelper,
  ) {}

  async edit({
    id,
    body: { title, content, author_ids, slug, category_id, is_draft },
  }: {
    body: CreateArticlesAdminBlogBody;
    id: number;
  }): Promise<ArticlesBlog> {
    const category =
      await this.databaseService.db.query.blog_categories.findFirst({
        where: (table, { eq }) => eq(table.id, category_id),
      });

    if (!category) {
      throw new NotFoundException('CATEGORY_NOT_FOUND');
    }

    const article = await this.databaseService.db.query.blog_articles.findFirst(
      {
        where: (table, { eq, and }) =>
          and(eq(table.id, id), eq(table.category_id, category_id)),
        columns: {
          id: true,
          is_draft: true,
          published_at: true,
        },
      },
    );

    if (!article) {
      throw new NotFoundException('ARTICLE_NOT_FOUND');
    }

    const findAuthors = await this.databaseService.db.query.core_users.findMany(
      {
        where: (table, { inArray }) => inArray(table.id, author_ids),
        columns: {
          id: true,
        },
      },
    );

    author_ids.forEach(author_id => {
      if (!findAuthors.find(author => author.id === author_id)) {
        throw new BadRequestException('AUTHOR_NOT_FOUND');
      }
    });

    const currentAuthors =
      await this.databaseService.db.query.blog_articles_authors.findMany({
        where: (table, { eq }) => eq(table.article_id, id),
      });

    // Compute the authors that need to be added
    const newAuthors = author_ids.filter(
      author_id =>
        !currentAuthors.some(
          currentAuthor => currentAuthor.user_id === author_id,
        ),
    );

    // Compute the authors that need to be removed
    const authorsToRemove = currentAuthors.filter(
      currentAuthor => !author_ids.includes(currentAuthor.user_id),
    );

    await this.databaseService.db.transaction(async tx => {
      // Insert new authors
      if (newAuthors.length > 0) {
        await tx.insert(blog_articles_authors).values(
          newAuthors.map(author_id => ({
            article_id: id,
            user_id: author_id,
          })),
        );
      }

      // Remove unwanted authors
      if (authorsToRemove.length > 0) {
        await tx.delete(blog_articles_authors).where(
          and(
            eq(blog_articles_authors.article_id, id),
            inArray(
              blog_articles_authors.user_id,
              authorsToRemove.map(author => author.user_id),
            ),
          ),
        );
      }
    });

    const titleFromDb = await this.stringLanguageHelper.parse({
      item_id: article.id,
      plugin_code: 'blog',
      database: blog_articles,
      data: title,
      variable: 'title',
    });
    const contentFromDb = await this.stringLanguageHelper.parse({
      item_id: article.id,
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

    const [data] = await this.databaseService.db
      .update(blog_articles)
      .set({
        slug: removeSpecialCharacters(slug),
        category_id,
        published_at:
          article.is_draft === is_draft ? article.published_at : new Date(),
        is_draft,
        edited_at: new Date(),
      })
      .where(eq(blog_articles.id, id))
      .returning();

    const authors: ArticlesBlog['authors'] = await Promise.all(
      author_ids.map(async author_id => {
        const user = await this.userHelper.getUserById({ id: author_id });

        if (!user) {
          throw new NotFoundException('USER_NOT_FOUND');
        }

        return user;
      }),
    );

    return {
      ...data,
      authors,
      title: titleFromDb,
      content: contentFromDb,
      category: {
        ...category,
        name: i18nCategory.filter(item => item.variable === 'name'),
      },
    };
  }
}
