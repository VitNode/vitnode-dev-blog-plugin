import { ImageIcon, UserIcon, UsersIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ArticlesBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';
import { DateFormat } from 'vitnode-frontend/components/date-format';
import { ImgFromApi } from 'vitnode-frontend/components/img-from-api';
import { Badge } from 'vitnode-frontend/components/ui/badge';
import { Card } from 'vitnode-frontend/components/ui/card';
import { Separator } from 'vitnode-frontend/components/ui/separator';
import { cn } from 'vitnode-frontend/helpers/classnames';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { Link } from 'vitnode-frontend/navigation';

import { getImagesFromEditorContent } from '../../helpers/get-images-from-editor';

const getData = async () => {
  const { data } = await fetcher<ArticlesBlogObj, ArticlesBlogQuery>({
    url: '/blog/articles',
    cache: 'force-cache',
  });

  return data;
};

export const BlogView = async () => {
  const [{ edges }, { convertText }, t] = await Promise.all([
    getData(),
    getTextLang(),
    getTranslations('blog'),
  ]);

  return (
    <div className="container my-10">
      <div className="my-20 space-y-2 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('desc')}</p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 sm:gap-10 xl:grid-cols-3">
        {edges.map(edge => {
          const href = `/blog/${edge.category.slug}/${edge.slug}`;
          const image = getImagesFromEditorContent(edge.content[0].value).at(0);

          return (
            <Card
              key={edge.id}
              style={
                {
                  '--color-category': edge.category.color
                    .replaceAll(',', '')
                    .replace(')', '/ 20%)'),
                } as React.CSSProperties
              }
            >
              <Link className="relative block h-40 sm:h-52" href={href}>
                {image ? (
                  <ImgFromApi
                    alt={convertText(edge.title)}
                    className="rounded-t-md object-cover"
                    {...image}
                    fill
                    id={`image-${edge.id}`}
                    sizes="(max-width: 640px) 100vw, 640px"
                  />
                ) : (
                  <div className="text-muted-foreground bg-secondary flex h-full items-center justify-center rounded-t-md opacity-20">
                    <ImageIcon className="size-24" />
                  </div>
                )}
              </Link>

              <div className="p-6">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link className="text-foreground flex-1" href={href}>
                    <h2 className="line-clamp-2 text-pretty text-lg font-medium">
                      {convertText(edge.title)}
                    </h2>
                  </Link>

                  <Link href={`/blog/${edge.category.slug}`}>
                    <Badge
                      className={cn(
                        'border-[var(--color-category)] bg-[var(--color-category)]',
                      )}
                      variant="outline"
                    >
                      {convertText(edge.category.name)}
                    </Badge>
                  </Link>
                </div>

                <Separator className="my-2" />

                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-1 [&>svg]:size-4">
                    {edge.authors.length > 1 ? <UsersIcon /> : <UserIcon />}
                    <span>{edge.authors[0].name}</span>
                    <span>
                      {edge.authors.length > 1 && `+${edge.authors.length - 1}`}
                    </span>
                  </div>

                  <DateFormat date={edge.published_at} />
                </div>
              </div>
            </Card>
          );
        })}
      </ul>
    </div>
  );
};
