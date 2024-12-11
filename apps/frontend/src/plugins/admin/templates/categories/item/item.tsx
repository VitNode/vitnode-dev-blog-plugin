import { CategoriesBlogObj } from 'shared/blog/categories';
import { DragAndDropSortableItem } from 'vitnode-frontend/components/drag&drop/sortable-list/list';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { Link } from 'vitnode-frontend/navigation';

import { DeleteItemCategoriesBlogAdmin } from './delete/delete';
import { EditItemCategoriesBlogAdmin } from './edit';

export const ItemCategoriesBlogAdmin = ({
  name,
  id,
  color,
  slug,
  ...props
}: CategoriesBlogObj['edges'][0]) => {
  const { convertText } = useTextLang();

  return (
    <DragAndDropSortableItem
      actions={
        <>
          <EditItemCategoriesBlogAdmin
            color={color}
            id={id}
            name={name}
            slug={slug}
            {...props}
          />
          <DeleteItemCategoriesBlogAdmin id={id} name={name} />
        </>
      }
      className="flex flex-1 items-center justify-between gap-2"
    >
      <div className="flex items-center gap-4">
        <div
          className="size-6 rounded-lg bg-[--color-category]"
          style={
            {
              '--color-category': color,
            } as React.CSSProperties
          }
        />
        <div className="flex flex-col">
          <span>{convertText(name)}</span>
          <Link
            className="text-sm"
            href={`/blog/category/${slug}`}
            target="_blank"
          >{`/blog/category/${slug}`}</Link>
        </div>
      </div>
    </DragAndDropSortableItem>
  );
};
