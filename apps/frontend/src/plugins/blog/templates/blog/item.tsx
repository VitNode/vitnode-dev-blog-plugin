import { ImageIcon, UserIcon, UsersIcon } from 'lucide-react';
import { ArticlesBlog } from 'shared/blog/articles';
import { DateFormat } from 'vitnode-frontend/components/date-format';
import { ImgFromApi } from 'vitnode-frontend/components/img-from-api';
import { Badge } from 'vitnode-frontend/components/ui/badge';
import { Card } from 'vitnode-frontend/components/ui/card';
import { Separator } from 'vitnode-frontend/components/ui/separator';
import { cn } from 'vitnode-frontend/helpers/classnames';
import { getTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { Link } from 'vitnode-frontend/navigation';

import { getImagesFromEditorContent } from '../../helpers/get-images-from-editor';

export const ItemArticleBlog = async ({
  category,
  slug,
  content,
  title,
  id,
  authors,
  published_at,
}: ArticlesBlog) => {
  const { convertText } = await getTextLang();
  const href = `/blog/${category.slug}/${slug}`;
  const image = getImagesFromEditorContent(content[0].value).at(0);

  return (
    <Card
      style={
        {
          '--color-category': category.color
            .replaceAll(',', '')
            .replace(')', '/ 20%)'),
        } as React.CSSProperties
      }
    >
      <Link className="relative block h-40 sm:h-52" href={href}>
        {image ? (
          <ImgFromApi
            alt={convertText(title)}
            className="rounded-t-md object-cover"
            {...image}
            fill
            id={`image-${id}`}
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
              {convertText(title)}
            </h2>
          </Link>

          <Link href={`/blog/${category.slug}`}>
            <Badge
              className={cn(
                'border-[var(--color-category)] bg-[var(--color-category)]',
              )}
              variant="outline"
            >
              {convertText(category.name)}
            </Badge>
          </Link>
        </div>

        <Separator className="my-2" />

        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-1 [&>svg]:size-4">
            {authors.length > 1 ? <UsersIcon /> : <UserIcon />}
            <span>{authors[0].name}</span>
            <span>{authors.length > 1 && `+${authors.length - 1}`}</span>
          </div>

          <DateFormat date={published_at} />
        </div>
      </div>
    </Card>
  );
};
