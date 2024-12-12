import { core_users } from '@/plugins/core/admin/database/schema/users';
import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';

import { blog_categories } from './categories';

export const blog_articles = pgTable('blog_articles', t => ({
  id: t.serial().primaryKey(),
  category_id: t
    .integer()
    .references(() => blog_categories.id)
    .notNull(),
  created_at: t.timestamp().notNull().defaultNow(),
  edited_at: t.timestamp().notNull().defaultNow(),
  published_at: t.timestamp().notNull().defaultNow(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  is_draft: t.boolean().notNull().default(false),
}));

export const blog_articles_relations = relations(
  blog_articles,
  ({ one, many }) => ({
    category: one(blog_categories, {
      fields: [blog_articles.category_id],
      references: [blog_categories.id],
    }),
    authors: many(blog_articles_authors),
  }),
);

export const blog_articles_authors = pgTable('blog_articles_authors', t => ({
  article_id: t
    .integer()
    .references(() => blog_articles.id)
    .notNull(),
  user_id: t
    .integer()
    .references(() => core_users.id)
    .notNull(),
}));

export const blog_articles_authors_relations = relations(
  blog_articles_authors,
  ({ one }) => ({
    article: one(blog_articles, {
      fields: [blog_articles_authors.article_id],
      references: [blog_articles.id],
    }),
    user: one(core_users, {
      fields: [blog_articles_authors.user_id],
      references: [core_users.id],
    }),
  }),
);
