import type { MetadataRoute } from 'next';

import { getArticlesData } from '@/plugins/blog/templates/blog/get-articles-data';
import { getMiddlewareData } from 'vitnode-frontend/api/get-middleware-data';
import { CONFIG } from 'vitnode-frontend/helpers/config-with-env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ categories }, { languages }] = await Promise.all([
    getArticlesData({}),
    getMiddlewareData(),
  ]);

  return categories.map(category => ({
    url: `${CONFIG.frontend_url}/blog/${category.slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
    lastModified: category.updated_at,
    alternates: Object.fromEntries(
      languages.map(lang => [
        lang.code,
        `${CONFIG.frontend_url}/${lang.code}/blog/${category.slug}`,
      ]),
    ),
  }));
}
