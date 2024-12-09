import { CategoriesBlogObj } from 'shared/blog/categories';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';

import { DeleteItemCategoriesBlogAdmin } from './delete/delete';
import { Link } from 'vitnode-frontend/navigation';

export const ItemCategoriesBlogAdmin = ({
  name,
  id,
  color,
  slug,
}: CategoriesBlogObj['edges'][0]) => {
  const { convertText } = useTextLang();

  return (
    <div className="flex flex-1 items-center justify-between gap-2">
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
            href={`/blog/category/${slug}`}
            target="_blank"
            className="text-sm"
          >{`/blog/category/${slug}`}</Link>
        </div>
      </div>

      <div>
        <DeleteItemCategoriesBlogAdmin id={id} name={name} />
        <DeleteItemCategoriesBlogAdmin id={id} name={name} />
      </div>
    </div>
  );
};
