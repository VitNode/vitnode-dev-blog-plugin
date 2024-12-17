'use client';

import { useTranslations } from 'next-intl';
import { ArticlesAdminBlogObj } from 'shared/blog/articles';
import { DateFormat } from 'vitnode-frontend/components/date-format';
import { Badge } from 'vitnode-frontend/components/ui/badge';
import { DataTable } from 'vitnode-frontend/components/ui/data-table';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';

import { DeleteItemArticlesBlogAdmin } from './delete/delete';
import { EditItemArticlesBlogAdmin } from './edit';

export const ArticlesBlogAdminView = ({
  edges,
  page_info,
}: ArticlesAdminBlogObj) => {
  const t = useTranslations('admin_blog.articles');
  const { convertText } = useTextLang();

  return (
    <DataTable
      columns={[
        {
          title: t('title_article'),
          id: 'title',
          cell: ({ row }) => {
            return convertText(row.title);
          },
        },
        {
          title: t('category'),
          id: 'category',
          cell: ({ row }) => {
            return (
              <span className="flex items-center gap-2">
                <div
                  className="size-4 rounded-sm bg-[--color-category]"
                  style={
                    {
                      '--color-category': row.category.color,
                    } as React.CSSProperties
                  }
                />

                {convertText(row.category.name)}
              </span>
            );
          },
        },
        {
          title: t('published_at'),
          id: 'published_at',
          cell: ({ row }) => {
            if (row.is_draft) {
              return <Badge variant="outline">{t('draft')}</Badge>;
            }

            return <DateFormat date={row.published_at} />;
          },
        },
        {
          title: t('edited_at'),
          id: 'edited_at',
          cell: ({ row }) => {
            return <DateFormat date={row.edited_at} />;
          },
        },
        {
          id: 'actions',
          cell: ({ row }) => {
            return (
              <>
                <EditItemArticlesBlogAdmin id={row.id} />
                <DeleteItemArticlesBlogAdmin {...row} />
              </>
            );
          },
        },
      ]}
      data={edges}
      defaultSorting={{
        sortBy: 'created_at',
        sortDirection: 'asc',
      }}
      pageInfo={page_info}
    />
  );
};
