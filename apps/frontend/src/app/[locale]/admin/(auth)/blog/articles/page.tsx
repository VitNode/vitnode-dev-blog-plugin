import { CreateArticlesBlogAdmin } from '@/plugins/blog/templates/admin/articles/actions/create';
import { ArticlesBlogAdminView } from '@/plugins/blog/templates/admin/articles/articles-blog-admin-view';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArticlesAdminBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';
import { TranslationsProvider } from 'vitnode-frontend/components/translations-provider';
import { HeaderContent } from 'vitnode-frontend/components/ui/header-content';
import {
  getPaginationTool,
  SearchParamsPagination,
} from 'vitnode-frontend/helpers/get-pagination-tool';

const getData = async (query: ArticlesBlogQuery) => {
  const { data } = await fetcher<ArticlesAdminBlogObj, ArticlesBlogQuery>({
    url: '/admin/blog/articles',
    query,
    cache: 'force-cache',
  });

  return data;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin_blog.articles');

  return {
    title: t('title'),
  };
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsPagination>;
}) {
  const variables = await getPaginationTool({
    searchParams,
  });

  const [t, data] = await Promise.all([
    getTranslations('admin_blog.articles'),
    getData(variables),
  ]);

  return (
    <TranslationsProvider namespaces="admin_blog.articles">
      <HeaderContent desc={t('desc')} h1={t('title')}>
        <CreateArticlesBlogAdmin categories={data.categories} />
      </HeaderContent>

      <ArticlesBlogAdminView {...data} />
    </TranslationsProvider>
  );
}
