import { getTranslations } from 'next-intl/server';
import { ArticlesBlogObj } from 'shared/blog/articles';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';

import { NavLayoutCategoryBlog } from './nav';

export const LayoutCategoryBlog = async ({
  children,
  categories,
  slug,
  count,
}: {
  categories: ArticlesBlogObj['categories'];
  children: React.ReactNode;
  count: number;
  slug?: string;
}) => {
  const [t, { convertText }] = await Promise.all([
    getTranslations('blog'),
    getTextLang(),
  ]);
  const category = categories.find(category => category.slug === slug);

  return (
    <>
      <div
        className="relative"
        style={
          category
            ? ({
                '--color-category': category.color,
              } as React.CSSProperties)
            : {}
        }
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[--color-category] opacity-20" />
        <div className="container relative z-10 flex max-w-4xl flex-col items-center justify-center gap-2 py-20 pb-32 text-center">
          <h1 className="text-balance text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            {category ? convertText(category.name) : t('title')}
          </h1>
          <p className="text-muted-foreground">{t('desc')}</p>

          {categories.length > 0 && (
            <div className="mt-6 flex max-w-prose items-center gap-2 overflow-x-auto px-6">
              <NavLayoutCategoryBlog categories={categories} slug={slug} />
            </div>
          )}
        </div>
      </div>

      {count ? (
        <div className="container relative z-10 -mt-10 mb-10 grid gap-6 sm:grid-cols-2 sm:gap-10 xl:grid-cols-3">
          {children}
        </div>
      ) : (
        <div className="container relative z-10 -mt-10 mb-10">
          <p className="text-muted-foreground text-center">
            {t('no_articles')}
          </p>
        </div>
      )}
    </>
  );
};
