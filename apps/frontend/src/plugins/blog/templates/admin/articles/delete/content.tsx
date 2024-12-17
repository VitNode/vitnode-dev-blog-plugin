import { useTranslations } from 'next-intl';
import { ArticlesAdminBlogObj } from 'shared/blog/articles';
import { toast } from 'sonner';
import {
  AlertDialogCancel,
  AlertDialogFooter,
  useAlertDialog,
} from 'vitnode-frontend/components/ui/alert-dialog';
import { Button } from 'vitnode-frontend/components/ui/button';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';

import { mutationApi } from './mutation-api';
import { SubmitDeleteItemArticlesBlogAdmin } from './submit';

export const ContentDeleteItemArticlesBlogAdmin = ({
  id,
  title,
  category,
  slug,
}: Pick<
  ArticlesAdminBlogObj['edges'][0],
  'category' | 'id' | 'slug' | 'title'
>) => {
  const t = useTranslations('admin_blog.articles.delete');
  const tGlobal = useTranslations('core.global');
  const { convertText } = useTextLang();
  const { setOpen } = useAlertDialog();

  const onSubmit = async () => {
    try {
      await mutationApi({ id, categorySlug: category.slug, slug });
      setOpen?.(false);
      toast.success(t('success'), {
        description: convertText(title),
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
        <SubmitDeleteItemArticlesBlogAdmin />
      </AlertDialogFooter>
    </form>
  );
};
