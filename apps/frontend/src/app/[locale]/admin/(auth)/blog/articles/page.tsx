import { CategoriesBlogAdminView } from '@/plugins/admin/templates/categories/categories-blog-admin-view';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { fetcher } from 'vitnode-frontend/api/fetcher';
import { HeaderContent } from 'vitnode-frontend/components/ui/header-content';
import { CategoriesBlogObj, CategoriesBlogQuery } from 'shared/blog/categories';

const getData = async (query: CategoriesBlogQuery) => {
  const { data } = await fetcher<CategoriesBlogObj, CategoriesBlogQuery>({
    url: '/admin/blog/categories',
    query,
  });

  return data;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin_blog.articles');

  return {
    title: t('title'),
  };
};

export default async function Page() {
  const [t, data] = await Promise.all([
    getTranslations('admin_blog.articles'),
    getData({}),
  ]);

  return (
    <>
      <HeaderContent desc={t('desc')} h1={t('title')}>
        options
      </HeaderContent>

      <CategoriesBlogAdminView {...data} />
    </>
  );
}
