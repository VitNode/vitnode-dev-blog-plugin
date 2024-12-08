import { CreateCategoryBlogAdmin } from '@/plugins/admin/templates/categories/actions/create';
import { CategoriesBlogAdminView } from '@/plugins/admin/templates/categories/categories-blog-admin-view';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CategoriesBlogObj, CategoriesBlogQuery } from 'shared/blog/categories';
import { fetcher } from 'vitnode-frontend/api/fetcher';
import { TranslationsProvider } from 'vitnode-frontend/components/translations-provider';
import { HeaderContent } from 'vitnode-frontend/components/ui/header-content';

const getData = async (query: CategoriesBlogQuery) => {
  const { data } = await fetcher<CategoriesBlogObj, CategoriesBlogQuery>({
    url: '/blog/categories',
    query,
    cache: 'force-cache',
  });

  return data;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin_blog.categories');

  return {
    title: t('title'),
  };
};

export default async function Page() {
  const [t, data] = await Promise.all([
    getTranslations('admin_blog.categories'),
    getData({}),
  ]);

  return (
    <TranslationsProvider namespaces="admin_blog.categories">
      <HeaderContent desc={t('desc')} h1={t('title')}>
        <CreateCategoryBlogAdmin />
      </HeaderContent>

      <CategoriesBlogAdminView {...data} />
    </TranslationsProvider>
  );
}
