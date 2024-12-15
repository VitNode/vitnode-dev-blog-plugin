'use client';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from 'vitnode-frontend/components/ui/button';
import { Link } from 'vitnode-frontend/navigation';

export const CreateArticlesBlogAdmin = () => {
  const t = useTranslations('admin_blog.articles.create');

  return (
    <Button asChild>
      <Link href="/admin/blog/articles/create">
        <PlusIcon /> {t('title')}
      </Link>
    </Button>
  );
};
