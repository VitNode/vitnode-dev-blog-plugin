'use server';

import { revalidatePath } from 'next/cache';
import {
  ArticlesBlog,
  CreateArticlesAdminBlogBody,
} from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';

export const createMutationApi = async (body: CreateArticlesAdminBlogBody) => {
  try {
    await fetcher<ArticlesBlog, CreateArticlesAdminBlogBody>({
      url: '/admin/blog/articles',
      method: 'POST',
      body,
    });

    revalidatePath('/[locale]/admin/(auth)/blog/articles', 'layout');
  } catch (err) {
    const error = err as Error;

    if (error.message.includes('ARTICLE_ALREADY_EXISTS')) {
      return { message: 'ARTICLE_ALREADY_EXISTS' };
    }

    throw err;
  }
};
