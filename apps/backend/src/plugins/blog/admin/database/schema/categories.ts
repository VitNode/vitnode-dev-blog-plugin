import { pgTable } from 'drizzle-orm/pg-core';

export const blog_categories = pgTable('blog_categories', t => ({
  id: t.serial().primaryKey(),
  color: t.varchar({ length: 6 }).notNull(),
  position: t.integer().notNull().default(0),
  code: t.varchar({ length: 255 }).notNull().unique(),
  created_at: t.timestamp().notNull().defaultNow(),
}));
