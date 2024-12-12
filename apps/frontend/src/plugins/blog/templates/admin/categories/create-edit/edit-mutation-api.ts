'use server';

import { revalidatePath } from 'next/cache';
import {
  CategoryBlog,
  EditCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { fetcher } from 'vitnode-frontend/api/fetcher';

export const editMutationApi = async ({
  id,
  ...body
}: EditCategoriesAdminBlogBody & { id: number }) => {
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

  revalidatePath('/[locale]/admin/(auth)/blog/articles', 'page');
  revalidatePath('/[locale]/admin/(auth)/blog/categories', 'page');
};
