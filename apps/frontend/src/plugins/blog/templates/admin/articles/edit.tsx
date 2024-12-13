import { PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ArticlesAdminBlogObj } from 'shared/blog/articles';
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
  import('./create-edit/create-edit').then(module => ({
    default: module.CreateEditBlogAdmin,
  })),
);

export const EditItemArticlesBlogAdmin = ({
  data,
  categories,
}: {
  categories: ArticlesAdminBlogObj['categories'];
  data: ArticlesAdminBlogObj['edges'][0];
}) => {
  const t = useTranslations('admin_blog.articles.edit');
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

      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{convertText(data.title)}</DialogDescription>
        </DialogHeader>

        <React.Suspense fallback={<Loader />}>
          <Content categories={categories} data={data} />
        </React.Suspense>
      </DialogContent>
    </Dialog>
  );
};
