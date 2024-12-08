import { CategoriesBlogObj } from 'shared/blog/categories';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';

import { DeleteItemCategoriesBlogAdmin } from './delete/delete';

export const ItemCategoriesBlogAdmin = ({
  name,
  id,
}: CategoriesBlogObj['edges'][0]) => {
  const { convertText } = useTextLang();

  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      {convertText(name)} - {id}
      <div>
        <DeleteItemCategoriesBlogAdmin id={id} name={name} />
      </div>
    </div>
  );
};
