import { BlogView } from '@/plugins/blog/templates/blog/blog-view';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getMiddlewareData } from 'vitnode-frontend/api/get-middleware-data';
import { redirect } from 'vitnode-frontend/navigation';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('blog');

  return {
    title: t('title'),
  };
};

export default async function Page() {
  const middleware = await getMiddlewareData();

  if (middleware.plugin_code_default === 'blog') {
    await redirect('/');
  }

  return <BlogView />;
}
