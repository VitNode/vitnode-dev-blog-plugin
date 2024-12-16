import { ChevronLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ArticlesBlog } from 'shared/blog/articles';
import { DateFormat } from 'vitnode-frontend/components/date-format';
import { ReadOnlyEditor } from 'vitnode-frontend/components/editor/read-only/read-only';
import { AvatarUser } from 'vitnode-frontend/components/ui/user/avatar';
import { GroupFormat } from 'vitnode-frontend/components/ui/user/group-format';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { Link } from 'vitnode-frontend/navigation';

export const ItemBlogView = async ({
  category,
  title,
  content,
  published_at,
  authors,
}: ArticlesBlog) => {
  const t = await getTranslations('blog');
  const { convertText } = await getTextLang();

  return (
    <article>
      <div
        className="relative"
        style={
          {
            '--color-category': category.color,
          } as React.CSSProperties
        }
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[--color-category] opacity-20" />
        <div className="container relative z-10 flex max-w-4xl flex-col items-center justify-center gap-4 py-20 pb-32">
          <span className="text-muted-foreground -ml-5 inline-flex gap-2 text-sm">
            <Link
              className="text-muted-foreground flex items-center gap-1 hover:underline"
              href="/blog"
            >
              <ChevronLeft className="size-5" />
              {t('title')}
            </Link>
            /
            <Link
              className="text-foreground hover:underline"
              href={`/blog/${category.slug}`}
            >
              {convertText(category.name)}
            </Link>
          </span>
          <h1 className="text-balance text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            {convertText(title)}
          </h1>
          <DateFormat className="text-muted-foreground" date={published_at} />

          <ul className="mt-4 flex items-center gap-6">
            {authors.map(author => (
              <li className="flex items-center gap-2" key={author.name_seo}>
                <AvatarUser sizeInRem={2} user={author} />
                <div className="flex flex-col">
                  <span className="leading-none">{author.name}</span>
                  <GroupFormat className="text-sm" group={author.group} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container relative z-10 -mt-10 mb-10 max-w-4xl">
        <ReadOnlyEditor className="leading-relaxed" value={content} />
      </div>
    </article>
  );
};
