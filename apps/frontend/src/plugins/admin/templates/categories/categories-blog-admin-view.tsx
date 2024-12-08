'use client';

import { CategoriesBlogObj } from 'shared/blog/categories';
import { DragAndDropSortableList } from 'vitnode-frontend/components/drag&drop/sortable-list/list';

import { ItemCategoriesBlogAdmin } from './item/item';

export const CategoriesBlogAdminView = ({ edges }: CategoriesBlogObj) => {
  const data = edges.map(edge => ({
    ...edge,
    children: [],
  }));

  return (
    <DragAndDropSortableList
      componentItem={data => <ItemCategoriesBlogAdmin {...data} />}
      data={data}
      maxDepth={0}
      onDragEnd={() => {}}
    />
  );
};
