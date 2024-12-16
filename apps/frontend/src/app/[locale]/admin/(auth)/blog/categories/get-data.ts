import { CategoriesBlogObj, CategoriesBlogQuery } from 'shared/blog/categories';
import { fetcher } from 'vitnode-frontend/api/fetcher';

export const getCategoriesAdminData = async (query: CategoriesBlogQuery) => {
  const { data } = await fetcher<CategoriesBlogObj, CategoriesBlogQuery>({
    url: '/blog/categories',
    query,
    cache: 'force-cache',
  });

  return data;
};
