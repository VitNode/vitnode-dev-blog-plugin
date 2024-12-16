import Image from 'next/image';
import { ArticlesBlogObj, ArticlesBlogQuery } from 'shared/blog/articles';
import { fetcher } from 'vitnode-frontend/api/fetcher';
import { DateFormat } from 'vitnode-frontend/components/date-format';
import { Badge } from 'vitnode-frontend/components/ui/badge';
import { Card } from 'vitnode-frontend/components/ui/card';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { Link } from 'vitnode-frontend/navigation';

import img from './photo.avif';

const getData = async () => {
  const { data } = await fetcher<ArticlesBlogObj, ArticlesBlogQuery>({
    url: '/blog/articles',
    cache: 'force-cache',
  });

  return data;
};

export const BlogView = async () => {
  const [{ edges }, { convertText }] = await Promise.all([
    getData(),
    getTextLang(),
  ]);

  return (
    <div className="container my-10">
      <ul className="grid gap-6 sm:grid-cols-2 sm:gap-10 xl:grid-cols-3">
        {edges.map(edge => {
          const href = `/blog/${edge.category.slug}/${edge.slug}`;

          return (
            <Card className="p-6" key={edge.id}>
              <Link className="relative block h-40 sm:h-52" href={href}>
                <Image
                  alt={convertText(edge.title)}
                  className="rounded-lg border object-cover"
                  fill
                  src={img}
                />
              </Link>

              <div className="mt-6">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <DateFormat
                    className="text-muted-foreground text-sm"
                    date={edge.published_at}
                  />

                  <Link
                    className="text-foreground"
                    href={`/blog/${edge.category.slug}`}
                  >
                    <Badge className="bg-card" variant="outline">
                      {convertText(edge.category.name)}
                    </Badge>
                  </Link>
                </div>

                <Link className="text-foreground" href={href}>
                  <h2 className="line-clamp-2 text-pretty text-lg font-medium">
                    {convertText(edge.title)}
                  </h2>
                </Link>
              </div>
            </Card>
          );
        })}
      </ul>
    </div>
  );
};
