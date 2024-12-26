import type { MetadataRoute } from 'next';

import { getArticlesData } from '@/plugins/blog/templates/blog/get-articles-data';
import { getMiddlewareData } from 'vitnode-frontend/api/get-middleware-data';
import { CONFIG } from 'vitnode-frontend/helpers/config-with-env';

export default async function sitemap({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<MetadataRoute.Sitemap> {
  const { categorySlug } = await params;
  const [{ edges }, { languages }] = await Promise.all([
    getArticlesData({ category_slug: categorySlug }),
    getMiddlewareData(),
  ]);

  return edges.map(article => ({
    url: `${CONFIG.frontend_url}/blog/${article.category.slug}/${article.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
    lastModified: article.edited_at,
    alternates: Object.fromEntries(
      languages.map(lang => [
        lang.code,
        `${CONFIG.frontend_url}/${lang.code}/blog/${article.category.slug}/${article.slug}`,
      ]),
    ),
  }));
}
