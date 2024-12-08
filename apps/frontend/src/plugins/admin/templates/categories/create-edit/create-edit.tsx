import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AutoForm } from 'vitnode-frontend/components/form/auto-form';
import { AutoFormColorPicker } from 'vitnode-frontend/components/form/fields/color-picker';
import { AutoFormInput } from 'vitnode-frontend/components/form/fields/input';
import { AutoFormStringLanguageInput } from 'vitnode-frontend/components/form/fields/text-language-input';
import { useDialog } from 'vitnode-frontend/components/ui/dialog';
import { zodLanguageInput } from 'vitnode-frontend/helpers/zod';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { z } from 'zod';

import { mutationApi } from './mutation-api';

export const CreateEditCategoryBlogAdmin = () => {
  const t = useTranslations('admin_blog.categories.create');
  const tErrors = useTranslations('core.global.errors');
  const { setOpen } = useDialog();
  const { convertText } = useTextLang();
  const formSchema = z.object({
    name: zodLanguageInput.min(1),
    slug: z.string().min(1),
    color: z.string().max(20),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await mutationApi(values);
      setOpen?.(false);

      toast.success(t('success'), {
        description: convertText(values.name),
      });
    } catch (_) {
      toast.error(tErrors('title'), {
        description: tErrors('internal_server_error'),
      });
    }
  };

  return (
    <AutoForm
      fields={[
        {
          id: 'name',
          label: t('name'),
          component: AutoFormStringLanguageInput,
        },
        {
          id: 'slug',
          label: t('slug.label'),
          description: t('slug.desc'),
          component: AutoFormInput,
        },
        {
          id: 'color',
          label: t('color'),
          component: AutoFormColorPicker,
        },
      ]}
      formSchema={formSchema}
      onSubmit={onSubmit}
    />
  );
};
