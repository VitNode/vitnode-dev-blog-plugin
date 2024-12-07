'use client';

import { CategoriesBlogObj } from 'shared/blog/categories';
import { DragAndDropSortableList } from 'vitnode-frontend/components/drag&drop/sortable-list/list';

export const CategoriesBlogAdminView = ({ edges }: CategoriesBlogObj) => {
  const data = edges.map(edge => ({
    ...edge,
    children: [],
  }));

  return (
    <DragAndDropSortableList
      componentItem={data => {
        return <div>{data.id}</div>;
      }}
      data={data}
    />
  );
};
