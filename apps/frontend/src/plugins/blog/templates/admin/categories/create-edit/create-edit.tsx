import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { CategoriesBlogObj } from 'shared/blog/categories';
import { toast } from 'sonner';
import { AutoForm } from 'vitnode-frontend/components/form/auto-form';
import { AutoFormColorPicker } from 'vitnode-frontend/components/form/fields/color-picker';
import { AutoFormInput } from 'vitnode-frontend/components/form/fields/input';
import { AutoFormStringLanguageInput } from 'vitnode-frontend/components/form/fields/text-language-input';
import { useDialog } from 'vitnode-frontend/components/ui/dialog';
import { zodLanguageInput } from 'vitnode-frontend/helpers/zod';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { z } from 'zod';

import { createMutationApi } from './create-mutation-api';
import { editMutationApi } from './edit-mutation-api';

export const CreateEditCategoryBlogAdmin = ({
  data,
}: {
  data?: CategoriesBlogObj['edges'][0];
}) => {
  const t = useTranslations('admin_blog.categories.create');
  const tErrors = useTranslations('core.global.errors');
  const { setOpen } = useDialog();
  const { convertText } = useTextLang();
  const formSchema = z.object({
    name: zodLanguageInput.min(1).default(data?.name ?? []),
    slug: z
      .string()
      .min(1)
      .default(data?.slug ?? ''),
    color: z
      .string()
      .min(1)
      .max(20)
      .default(data?.color ?? ''),
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    form: UseFormReturn<z.infer<typeof formSchema>>,
  ) => {
    let error = '';
    if (data) {
      const mutation = await editMutationApi({
        ...values,
        id: data.id,
        position: data.position,
      });

      if (mutation?.message) {
        error = mutation.message;
      }
    } else {
      const mutation = await createMutationApi(values);

      if (mutation?.message) {
        error = mutation.message;
      }
    }

    if (error) {
      if (error === 'CATEGORY_ALREADY_EXISTS') {
        form.setError('slug', {
          message: t('slug.category_already_exists'),
        });

        return;
      }

      toast.error(tErrors('title'), {
        description: tErrors('internal_server_error'),
      });

      return;
    }

    setOpen?.(false);

    toast.success(t('success'), {
      description: convertText(values.name),
    });
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
