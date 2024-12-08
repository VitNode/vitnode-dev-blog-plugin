'use server';

import { revalidatePath } from 'next/cache';
import {
  CategoryBlog,
  CreateCategoriesAdminBlogBody,
} from 'shared/blog/categories';
import { fetcher } from 'vitnode-frontend/api/fetcher';

export const mutationApi = async (body: CreateCategoriesAdminBlogBody) => {
  await fetcher<CategoryBlog, CreateCategoriesAdminBlogBody>({
    url: '/admin/blog/categories',
    method: 'POST',
    body: body,
  });

  revalidatePath('/[locale]/admin/(auth)/blog/categories', 'page');
};
