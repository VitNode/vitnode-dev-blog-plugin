'use server';

import { fetcher } from 'vitnode-frontend/api/fetcher';

import { revalidateArticleApi } from '../revalidate-article-api';

export const mutationApi = async ({
  id,
  categorySlug,
  slug,
}: {
  categorySlug: string;
  id: number;
  slug: string;
}) => {
  await fetcher<object>({
    url: `/admin/blog/articles/${id}`,
    method: 'DELETE',
  });

  revalidateArticleApi({ categorySlug, slug });
};
