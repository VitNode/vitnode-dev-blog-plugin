import { PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ArticlesAdminBlogObj } from 'shared/blog/articles';
import { Button } from 'vitnode-frontend/components/ui/button';
import { TooltipWrapper } from 'vitnode-frontend/components/ui/tooltip';
import { Link } from 'vitnode-frontend/navigation';

export const EditItemArticlesBlogAdmin = ({
  id,
}: {
  id: ArticlesAdminBlogObj['edges'][0]['id'];
}) => {
  const t = useTranslations('admin_blog.articles.edit');

  return (
    <TooltipWrapper content={t('title')}>
      <Button ariaLabel={t('title')} asChild size="icon" variant="ghost">
        <Link href={`/admin/blog/articles/edit/${id}`}>
          <PencilIcon />
        </Link>
      </Button>
    </TooltipWrapper>
  );
};
