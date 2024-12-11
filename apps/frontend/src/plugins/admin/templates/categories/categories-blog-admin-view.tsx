'use client';

import { useTranslations } from 'next-intl';
import { CategoriesBlogObj } from 'shared/blog/categories';
import { toast } from 'sonner';
import { DragAndDropSortableList } from 'vitnode-frontend/components/drag&drop/sortable-list/list';

import { editMutationApi } from './create-edit/edit-mutation-api';
import { ItemCategoriesBlogAdmin } from './item/item';

export const CategoriesBlogAdminView = ({ edges }: CategoriesBlogObj) => {
  const tErrors = useTranslations('core.global.errors');
  const data = edges.map(edge => ({
    ...edge,
    children: [],
  }));

  return (
    <DragAndDropSortableList
      componentItem={data => <ItemCategoriesBlogAdmin {...data} />}
      data={data}
      maxDepth={0}
      onDragEnd={async ({ id, indexToMove }) => {
        const item = data.find(item => item.id === id);
        if (!item) return;

        try {
          await editMutationApi({
            ...item,
            id: item.id,
            position: indexToMove,
          });
        } catch (_) {
          toast.error(tErrors('title'), {
            description: tErrors('internal_server_error'),
          });
        }
      }}
    />
  );
};
