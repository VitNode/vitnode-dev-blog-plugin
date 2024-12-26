'use server';

import {
  CategoryBlog,
  CreateCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { fetcher } from 'vitnode-frontend/api/fetcher';

import { revalidateCategoryApi } from '../revalidate-article-api';

export const createMutationApi = async (
  body: CreateCategoriesAdminBlogBody,
) => {
  try {
    await fetcher<CategoryBlog, CreateCategoriesAdminBlogBody>({
      url: '/admin/blog/categories',
      method: 'POST',
      body: body,
    });
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('CATEGORY_ALREADY_EXISTS')) {
      return { message: 'CATEGORY_ALREADY_EXISTS' };
    }

    return { message: 'INTERNAL_SERVER_ERROR' };
  }

  revalidateCategoryApi({
    slug: body.slug,
  });
};
