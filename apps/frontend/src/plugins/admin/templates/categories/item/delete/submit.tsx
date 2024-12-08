import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';
import { Button } from 'vitnode-frontend/components/ui/button';

export const SubmitDeleteItemCategoriesBlogAdmin = () => {
  const t = useTranslations('admin_blog.categories.delete');
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} type="submit">
      {t('submit')}
    </Button>
  );
};
