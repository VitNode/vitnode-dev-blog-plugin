import { CreateEditBlogAdmin } from '@/plugins/blog/templates/admin/articles/create-edit/create-edit';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArticlesAdminBlog } from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';
import { getSessionAdminData } from 'vitnode-frontend/api/get-session-admin-data';
import { TranslationsProvider } from 'vitnode-frontend/components/translations-provider';
import { Card } from 'vitnode-frontend/components/ui/card';
import { HeaderContent } from 'vitnode-frontend/components/ui/header-content';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';

import { getCategoriesAdminData } from '../../../categories/get-data';

const getData = async (id: string) => {
  const { data } = await fetcher<ArticlesAdminBlog>({
    url: `/admin/blog/articles/${id}`,
    cache: 'force-cache',
  });

  return data;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin_blog.articles.edit');

  return {
    title: t('title'),
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const [t, categories, data, { convertText }, { user }] = await Promise.all([
      getTranslations('admin_blog.articles.edit'),
      getCategoriesAdminData({}),
      getData(id),
      getTextLang(),
      getSessionAdminData(),
    ]);

    return (
      <TranslationsProvider
        namespaces={['admin_blog.articles.create', 'admin_blog.articles.edit']}
      >
        <div className="mx-auto max-w-4xl">
          <HeaderContent desc={convertText(data.title)} h1={t('title')} />

          <Card className="p-6">
            <CreateEditBlogAdmin
              categories={categories.edges}
              data={data}
              user={user}
            />
          </Card>
        </div>
      </TranslationsProvider>
    );
  } catch (err) {
    const error = err as Error;

    if (error.message.includes('404')) {
      return notFound();
    }

    throw error;
  }
}
