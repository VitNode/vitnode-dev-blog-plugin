import { CreateCategoryBlogAdmin } from '@/plugins/blog/templates/admin/categories/actions/create';
import { CategoriesBlogAdminView } from '@/plugins/blog/templates/admin/categories/categories-blog-admin-view';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TranslationsProvider } from 'vitnode-frontend/components/translations-provider';
import { HeaderContent } from 'vitnode-frontend/components/ui/header-content';

import { getCategoriesAdminData } from './get-data';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin_blog.categories');

  return {
    title: t('title'),
  };
};

export default async function Page() {
  const [t, data] = await Promise.all([
    getTranslations('admin_blog.categories'),
    getCategoriesAdminData({}),
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
