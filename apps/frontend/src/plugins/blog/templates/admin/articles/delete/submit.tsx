import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';
import { Button } from 'vitnode-frontend/components/ui/button';

export const SubmitDeleteItemArticlesBlogAdmin = () => {
  const t = useTranslations('admin_blog.articles.delete');
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} type="submit" variant="destructive">
      {t('submit')}
    </Button>
  );
};
