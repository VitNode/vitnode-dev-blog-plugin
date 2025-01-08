import { BlogView } from '@/plugins/blog/templates/blog/blog-view';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('blog');

  return {
    title: t('title'),
  };
};

export default function Page() {
  return <BlogView />;
}
