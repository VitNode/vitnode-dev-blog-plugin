'use client';

import { CategoriesBlogObj } from 'shared/blog/categories';
import { DragAndDropSortableList } from 'vitnode-frontend/components/drag&drop/sortable-list/list';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';

export const CategoriesBlogAdminView = ({ edges }: CategoriesBlogObj) => {
  const { convertText } = useTextLang();
  const data = edges.map(edge => ({
    ...edge,
    children: [],
  }));

  return (
    <DragAndDropSortableList
      componentItem={data => {
        return <div>{convertText(data.name)}</div>;
      }}
      data={data}
    />
  );
};
