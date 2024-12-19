import { ArticlesBlogObj } from 'shared/blog/articles';
import { Button } from 'vitnode-frontend/components/ui/button';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { Link } from 'vitnode-frontend/navigation';

export const NavLayoutCategoryBlog = async ({
  categories,
  slug,
}: {
  categories: ArticlesBlogObj['categories'];
  slug: string | undefined;
}) => {
  const { convertText } = await getTextLang();

  return (
    <>
      {categories.map(category => (
        <Button
          asChild
          className="rounded-full"
          key={category.slug}
          variant={slug === category.slug ? 'default' : 'ghost'}
        >
          <Link href={`/blog/${category.slug}`}>
            {convertText(category.name)}
          </Link>
        </Button>
      ))}
    </>
  );
};
