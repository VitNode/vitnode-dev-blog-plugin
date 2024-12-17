'use server';

import {
  ArticlesBlog,
  CreateArticlesAdminBlogBody,
} from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';

import { revalidateArticleApi } from '../revalidate-article-api';

export const editMutationApi = async ({
  id,
  prevSlug,
  ...body
}: CreateArticlesAdminBlogBody & { id: number; prevSlug: string }) => {
  try {
    const { data } = await fetcher<ArticlesBlog, CreateArticlesAdminBlogBody>({
      url: `/admin/blog/articles/${id}`,
      method: 'PUT',
      body,
    });

    revalidateArticleApi({
      slug: body.slug,
      categorySlug: data.category.slug,
      prevSlug,
    });
  } catch (err) {
    const error = err as Error;

    if (error.message.includes('ARTICLE_ALREADY_EXISTS')) {
      return { message: 'ARTICLE_ALREADY_EXISTS' };
    }

    throw err;
  }
};
