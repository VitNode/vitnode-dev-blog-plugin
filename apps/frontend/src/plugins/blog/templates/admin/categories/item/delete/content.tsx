import { useTranslations } from 'next-intl';
import { CategoriesBlogObj } from 'shared/blog/categories';
import { toast } from 'sonner';
import {
  AlertDialogCancel,
  AlertDialogFooter,
  useAlertDialog,
} from 'vitnode-frontend/components/ui/alert-dialog';
import { Button } from 'vitnode-frontend/components/ui/button';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';

import { mutationApi } from './mutation-api';
import { SubmitDeleteItemCategoriesBlogAdmin } from './submit';

export const ContentDeleteItemCategoriesBlogAdmin = ({
  id,
  name,
  slug,
}: Pick<CategoriesBlogObj['edges'][0], 'id' | 'name' | 'slug'>) => {
  const t = useTranslations('admin_blog.categories.delete');
  const tGlobal = useTranslations('core.global');
  const { convertText } = useTextLang();
  const { setOpen } = useAlertDialog();

  const onSubmit = async () => {
    try {
      await mutationApi({ id, slug });
      setOpen?.(false);
      toast.success(t('success'), {
        description: convertText(name),
      });
    } catch (_) {
      toast.error(tGlobal('errors.title'), {
        description: tGlobal('errors.internal_server_error'),
      });
    }
  };

  return (
    <form action={onSubmit}>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="ghost">{tGlobal('cancel')}</Button>
        </AlertDialogCancel>
        <SubmitDeleteItemCategoriesBlogAdmin />
      </AlertDialogFooter>
    </form>
  );
};
