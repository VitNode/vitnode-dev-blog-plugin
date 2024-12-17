import { ItemBlogView } from '@/plugins/blog/templates/blog/item/item-blog-view';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticlesBlog } from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';

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
    next: {
      tags: [`blog_articles__${category_slug}_${slug}`],
    },
  });

  return data;
};

interface Props {
  params: Promise<{ articleSlug: string; categorySlug: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { categorySlug, articleSlug } = await params;
  const [data, { convertText }] = await Promise.all([
    getData({
      slug: articleSlug,
      category_slug: categorySlug,
    }),
    getTextLang(),
  ]);

  return {
    title: convertText(data.title),
  };
};

export default async function Page({ params }: Props) {
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
