'use client';

import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ArticlesAdminBlog, ArticlesBlogObj } from 'shared/blog/articles';
import { toast } from 'sonner';
import { getUsersShortApi } from 'vitnode-frontend/api/get-users-short-api';
import { AutoForm } from 'vitnode-frontend/components/form/auto-form';
import { AutoFormCombobox } from 'vitnode-frontend/components/form/fields/combobox';
import { AutoFormEditor } from 'vitnode-frontend/components/form/fields/editor';
import { AutoFormInput } from 'vitnode-frontend/components/form/fields/input';
import { AutoFormSwitch } from 'vitnode-frontend/components/form/fields/switch';
import { AutoFormStringLanguageInput } from 'vitnode-frontend/components/form/fields/text-language-input';
import { Button } from 'vitnode-frontend/components/ui/button';
import { AvatarUser } from 'vitnode-frontend/components/ui/user/avatar';
import { GroupFormat } from 'vitnode-frontend/components/ui/user/group-format';
import {
  zodComboBoxWithFetcher,
  zodLanguageInput,
} from 'vitnode-frontend/helpers/zod';
import { useSessionAdmin } from 'vitnode-frontend/hooks/use-session-admin';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { Link, useRouter } from 'vitnode-frontend/navigation';
import { z } from 'zod';

import { createMutationApi } from './create-mutation-api';

export const CreateEditBlogAdmin = ({
  categories,
  data,
}: {
  categories: ArticlesBlogObj['categories'];
  data?: ArticlesAdminBlog;
}) => {
  const { user } = useSessionAdmin();
  const t = useTranslations('admin_blog.articles');
  const tCore = useTranslations('core.global');
  const { convertText } = useTextLang();
  const { push } = useRouter();
  const formSchema = z.object({
    title: zodLanguageInput.min(1).default(data?.title ?? []),
    content: zodLanguageInput.min(1).default(data?.content ?? []),
    slug: z
      .string()
      .min(1)
      .default(data?.slug ?? ''),
    publish_at: z
      .string()
      .default(data?.published_at.toString() ?? '')
      .optional(),
    is_draft: z
      .boolean()
      .default(data?.is_draft ?? false)
      .optional(),
    category_id: z
      .enum([...categories.map(category => category.id.toString())] as [
        string,
        ...string[],
      ])
      .default(data?.category.id.toString() ?? ''),
    authors: zodComboBoxWithFetcher.min(1).default(
      data?.authors
        ? data.authors.map(author => ({
            key: author.id.toString(),
            value: author.name,
          }))
        : [
            {
              key: user.id.toString(),
              value: user.name,
            },
          ],
    ),
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    form: UseFormReturn<z.infer<typeof formSchema>>,
  ) => {
    let error = '';
    const preValues = {
      ...values,
      category_id: +values.category_id,
      author_ids: values.authors.map(author => +author.key),
    };

    const mutation = await createMutationApi(preValues);
    if (mutation?.message) {
      error = mutation.message;
    }

    if (error) {
      if (error.includes('ARTICLE_ALREADY_EXISTS')) {
        form.setError('slug', {
          type: 'manual',
          message: t('create.slug.article_already_exists'),
        });

        return;
      }

      toast.error(tCore('errors.title'), {
        description: tCore('errors.internal_server_error'),
      });

      return;
    }

    push('/admin/blog/articles');
    toast.success(t(`${data ? 'edit' : 'create'}.success`), {
      description: convertText(values.title),
    });
  };

  return (
    <AutoForm
      fields={[
        {
          id: 'title',
          label: t('create.title_article'),
          component: AutoFormStringLanguageInput,
        },
        {
          id: 'slug',
          label: t('create.slug.label'),
          description: t('create.slug.desc'),
          component: AutoFormInput,
        },
        {
          id: 'category_id',
          label: t('create.category'),
          component: props => (
            <AutoFormCombobox
              labels={Object.fromEntries(
                categories.map(category => [
                  category.id.toString(),
                  <div className="flex items-center gap-2" key={category.id}>
                    <div
                      className="size-4 rounded-sm bg-[--color-category]"
                      style={
                        {
                          '--color-category': category.color,
                        } as React.CSSProperties
                      }
                    />
                    {convertText(category.name)}
                  </div>,
                ]),
              )}
              {...props}
            />
          ),
        },
        {
          id: 'authors',
          label: t('create.authors'),
          component: props => (
            <AutoFormCombobox
              {...props}
              multiple
              withFetcher={{
                queryKey: 'Core_Members__Show__Search',
                search: true,
                queryFn: async ({ search }: { search: string }) => {
                  try {
                    const mutation = await getUsersShortApi({ search });

                    return (mutation.edges ?? []).map(item => ({
                      key: item.id.toString(),
                      value: item.name,
                      valueWithFormatting: (
                        <>
                          <AvatarUser sizeInRem={1.75} user={item} />
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            <GroupFormat
                              className="text-xs"
                              group={item.group}
                            />
                          </div>
                        </>
                      ),
                    }));
                  } catch (_) {
                    toast.error(tCore('errors.title'), {
                      description: tCore('errors.internal_server_error'),
                    });

                    return [];
                  }
                },
              }}
            />
          ),
        },
        {
          id: 'content',
          label: t('create.content'),
          component: props => (
            <AutoFormEditor
              {...props}
              allowUploadFiles={{
                plugin_code: 'blog',
                folder: 'articles',
              }}
            />
          ),
        },
        {
          id: 'publish_at',
          label: t('create.publish_at'),
          component: props => (
            <AutoFormInput
              className="max-w-fit"
              type="datetime-local"
              {...props}
            />
          ),
        },
        {
          id: 'is_draft',
          label: t('create.is_draft'),
          component: AutoFormSwitch,
        },
      ]}
      formSchema={formSchema}
      onSubmit={onSubmit}
      submitButton={props => (
        <>
          <Button asChild variant="ghost">
            <Link href="/admin/blog/articles">{tCore('cancel')}</Link>
          </Button>
          <Button {...props}>{t(`${data ? 'edit' : 'create'}.submit`)}</Button>
        </>
      )}
    />
  );
};
