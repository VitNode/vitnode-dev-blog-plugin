'use server';

import { fetcher } from 'vitnode-frontend/api/fetcher';

import { revalidateCategoryApi } from '../../revalidate-article-api';

export const mutationApi = async ({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) => {
  await fetcher<object>({
    url: `/admin/blog/categories/${id}`,
    method: 'DELETE',
  });

  revalidateCategoryApi({
    slug,
  });
};
