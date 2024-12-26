import { notFound } from 'next/navigation';
import { ArticlesBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';

export const getArticlesData = async (query: ArticlesBlogQuery) => {
  try {
    const { data } = await fetcher<ArticlesBlogObj, ArticlesBlogQuery>({
      url: '/blog/articles',
      cache: 'force-cache',
      query,
      next: {
        tags: query.category_slug
          ? [`blog_articles__${query.category_slug}`]
          : [],
      },
    });

    return data;
  } catch (err) {
    const error = err as Error;

    if (error.message.includes('404')) {
      notFound();
    }

    throw error;
  }
};
