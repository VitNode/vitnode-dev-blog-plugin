'use server';

import {
  CategoryBlog,
  EditCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { fetcher } from 'vitnode-frontend/api/fetcher';

import { revalidateCategoryApi } from '../revalidate-article-api';

export const editMutationApi = async ({
  id,
  prevSlug,
  ...body
}: EditCategoriesAdminBlogBody & { id: number; prevSlug: string }) => {
  try {
    await fetcher<CategoryBlog, EditCategoriesAdminBlogBody>({
      url: `/admin/blog/categories/${id}`,
      method: 'PUT',
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
    prevSlug,
  });
};
