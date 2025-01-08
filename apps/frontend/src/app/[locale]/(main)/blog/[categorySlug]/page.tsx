import { CategoryBlogView } from '@/plugins/blog/templates/blog/category/layout/category-view';
import { LayoutCategoryBlog } from '@/plugins/blog/templates/blog/category/layout/layout';
import { getArticlesData } from '@/plugins/blog/templates/blog/get-articles-data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { categorySlug } = await params;
  const [{ categories }, { convertText }] = await Promise.all([
    getArticlesData({
      category_slug: categorySlug,
    }),
    getTextLang(),
  ]);
  const category = categories.find(category => category.slug === categorySlug);
  if (!category) {
    notFound();
  }

  return {
    title: convertText(category.name),
  };
};

export default async function Page({ params }: Props) {
  const { categorySlug } = await params;
  const { edges, categories } = await getArticlesData({
    category_slug: categorySlug,
  });

  return (
    <LayoutCategoryBlog
      categories={categories}
      count={edges.length}
      slug={categorySlug}
    >
      <CategoryBlogView edges={edges} />
    </LayoutCategoryBlog>
  );
}
