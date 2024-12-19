import { ArticleBlogView } from '@/plugins/blog/templates/blog/article/article-view';
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
  try {
    const { data } = await fetcher<ArticlesBlog>({
      url: `/blog/articles/${category_slug}/${slug}`,
      cache: 'force-cache',
      next: {
        tags: [`blog_articles__${category_slug}_${slug}`],
      },
    });

    return data;
  } catch (err) {
    const error = err as Error;

    if (error.message.includes('404')) {
      notFound();
    }

    throw error;
  }
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
    title: `${convertText(data.title)} - ${convertText(data.category.name)}`,
  };
};

export default async function Page({ params }: Props) {
  const { categorySlug, articleSlug } = await params;
  const data = await getData({
    slug: articleSlug,
    category_slug: categorySlug,
  });

  return <ArticleBlogView {...data} />;
}
