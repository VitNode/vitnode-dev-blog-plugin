import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeaderContent } from 'vitnode-frontend/components/ui/header-content';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('admin_blog.articles');

  return {
    title: t('title'),
  };
};

export default async function Page() {
  const t = await getTranslations('admin_blog.articles');

  return (
    <HeaderContent desc={t('desc')} h1={t('title')}>
      options
    </HeaderContent>
  );
}
