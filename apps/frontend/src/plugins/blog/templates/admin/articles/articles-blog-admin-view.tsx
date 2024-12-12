'use client';

import { ArticlesAdminBlogObj } from 'shared/blog/articles';
import { DataTable } from 'vitnode-frontend/components/ui/data-table';

export const ArticlesBlogAdminView = ({
  edges,
  page_info,
}: ArticlesAdminBlogObj) => {
  return (
    <DataTable
      columns={[{ title: 'ID', id: 'id' }]}
      data={edges}
      defaultSorting={{
        sortBy: 'created_at',
        sortDirection: 'asc',
      }}
      pageInfo={page_info}
    />
  );
};
