import { CreateEditBlogAdmin } from '@/plugins/blog/templates/admin/articles/create-edit/create-edit';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TranslationsProvider } from 'vitnode-frontend/components/translations-provider';
import { Card } from 'vitnode-frontend/components/ui/card';
import { HeaderContent } from 'vitnode-frontend/components/ui/header-content';

import { getCategoriesData } from '../../categories/page';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin_blog.articles.create');

  return {
    title: t('title'),
  };
};

export default async function Page() {
  const t = await getTranslations('admin_blog.articles.create');
  const categories = await getCategoriesData({});

  return (
    <TranslationsProvider namespaces="admin_blog.articles.create">
      <HeaderContent desc={t('desc')} h1={t('title')} />

      <Card className="p-6">
        <CreateEditBlogAdmin categories={categories.edges} />
      </Card>
    </TranslationsProvider>
  );
}
