import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getMiddlewareData } from 'vitnode-frontend/api/get-middleware-data';

export const generateMetadata = async (): Promise<Metadata> => {
  const [t, { site_short_name }] = await Promise.all([
    getTranslations('blog'),
    getMiddlewareData(),
  ]);

  return {
    title: {
      default: t('title'),
      template: `%s - ${t('title')} - ${site_short_name}`,
    },
  };
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
