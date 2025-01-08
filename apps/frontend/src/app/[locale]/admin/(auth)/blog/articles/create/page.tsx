import { CreateEditBlogAdmin } from '@/plugins/blog/templates/admin/articles/create-edit/create-edit';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSessionAdminData } from 'vitnode-frontend/api/get-session-admin-data';
import { TranslationsProvider } from 'vitnode-frontend/components/translations-provider';
import { Card } from 'vitnode-frontend/components/ui/card';
import { HeaderContent } from 'vitnode-frontend/components/ui/header-content';

import { getCategoriesAdminData } from '../../categories/get-data';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin_blog.articles.create');

  return {
    title: t('title'),
  };
};

export default async function Page() {
  const [t, categories, { user }] = await Promise.all([
    getTranslations('admin_blog.articles.create'),
    getCategoriesAdminData({}),
    getSessionAdminData(),
  ]);

  return (
    <TranslationsProvider namespaces="admin_blog.articles.create">
      <div className="mx-auto max-w-4xl">
        <HeaderContent desc={t('desc')} h1={t('title')} />

        <Card className="p-6">
          <CreateEditBlogAdmin categories={categories.edges} user={user} />
        </Card>
      </div>
    </TranslationsProvider>
  );
}
