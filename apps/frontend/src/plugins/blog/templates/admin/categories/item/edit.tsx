import { PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { CategoriesBlogObj } from 'shared/blog/categories';
import { Button } from 'vitnode-frontend/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'vitnode-frontend/components/ui/dialog';
import { Loader } from 'vitnode-frontend/components/ui/loader';
import { TooltipWrapper } from 'vitnode-frontend/components/ui/tooltip';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';

const Content = React.lazy(async () =>
  import('../create-edit/create-edit').then(module => ({
    default: module.CreateEditCategoryBlogAdmin,
  })),
);

export const EditItemCategoriesBlogAdmin = (
  props: CategoriesBlogObj['edges'][0],
) => {
  const t = useTranslations('admin_blog.categories.edit');
  const { convertText } = useTextLang();

  return (
    <Dialog>
      <TooltipWrapper content={t('title')}>
        <DialogTrigger asChild>
          <Button ariaLabel={t('title')} size="icon" variant="ghost">
            <PencilIcon />
          </Button>
        </DialogTrigger>
      </TooltipWrapper>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{convertText(props.name)}</DialogDescription>
        </DialogHeader>

        <React.Suspense fallback={<Loader />}>
          <Content data={props} />
        </React.Suspense>
      </DialogContent>
    </Dialog>
  );
};
