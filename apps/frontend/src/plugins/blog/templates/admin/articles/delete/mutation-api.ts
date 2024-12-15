'use server';

import { revalidatePath } from 'next/cache';
import { fetcher } from 'vitnode-frontend/api/fetcher';

export const mutationApi = async (id: number) => {
  await fetcher<object>({
    url: `/admin/blog/articles/${id}`,
    method: 'DELETE',
  });

  revalidatePath('/[locale]/admin/(auth)/blog/articles', 'layout');
};
