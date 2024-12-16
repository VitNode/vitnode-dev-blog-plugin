import { ItemBlogView } from '@/plugins/blog/templates/blog/item/item-blog-view';
import { notFound } from 'next/navigation';
import { ArticlesBlog } from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';

const getData = async ({
  slug,
  category_slug,
}: {
  category_slug: string;
  slug: string;
}) => {
  const { data } = await fetcher<ArticlesBlog>({
    url: `/blog/articles/${category_slug}/${slug}`,
    cache: 'force-cache',
  });

  return data;
};

export default async function Page({
  params,
}: {
  params: Promise<{ articleSlug: string; categorySlug: string }>;
}) {
  const { categorySlug, articleSlug } = await params;
  try {
    const data = await getData({
      slug: articleSlug,
      category_slug: categorySlug,
    });

    return <ItemBlogView {...data} />;
  } catch (err) {
    const error = err as Error;

    if (error.message.includes('404')) {
      notFound();
    }

    throw error;
  }
}
