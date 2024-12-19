import { ArticlesBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';

export const getArticlesData = async (query: ArticlesBlogQuery) => {
  const { data } = await fetcher<ArticlesBlogObj, ArticlesBlogQuery>({
    url: '/blog/articles',
    cache: 'force-cache',
    query,
  });

  return data;
};
