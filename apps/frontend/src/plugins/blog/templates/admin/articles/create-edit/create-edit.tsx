'use client';

import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import {
  ArticlesAdminBlog,
  ArticlesBlog,
  ArticlesBlogObj,
  CreateArticlesAdminBlogBody,
} from 'shared/blog/articles';
import { toast } from 'sonner';
import { fetcherClient } from 'vitnode-frontend/api/fetcher-client';
import { getUsersShortApi } from 'vitnode-frontend/api/get-users-short-api';
import { AutoForm } from 'vitnode-frontend/components/form/auto-form';
import { AutoFormCombobox } from 'vitnode-frontend/components/form/fields/combobox';
import { AutoFormEditor } from 'vitnode-frontend/components/form/fields/editor';
import { AutoFormFileInput } from 'vitnode-frontend/components/form/fields/file-input';
import { AutoFormInput } from 'vitnode-frontend/components/form/fields/input';
import { AutoFormSwitch } from 'vitnode-frontend/components/form/fields/switch';
import { AutoFormStringLanguageInput } from 'vitnode-frontend/components/form/fields/text-language-input';
import { Button } from 'vitnode-frontend/components/ui/button';
import { AvatarUser } from 'vitnode-frontend/components/ui/user/avatar';
import { GroupFormat } from 'vitnode-frontend/components/ui/user/group-format';
import {
  zodComboBoxWithFetcher,
  zodFile,
  zodLanguageInput,
} from 'vitnode-frontend/helpers/zod';
import { useSessionAdmin } from 'vitnode-frontend/hooks/use-session-admin';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';
import { Link, useRouter } from 'vitnode-frontend/navigation';
import { z } from 'zod';

import { mutationApi } from './mutation-api';

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
    image: zodFile.optional(),
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
    const formData = new FormData();
    values.title.forEach(title => {
      formData.append('title', JSON.stringify(title));
    });
    values.content.forEach(content => {
      formData.append('content', JSON.stringify(content));
    });
    formData.append('slug', values.slug);
    formData.append('is_draft', values.is_draft ? 'true' : 'false');
    formData.append('category_id', values.category_id);
    if (values.publish_at) {
      formData.append('publish_at', values.publish_at);
    }
    if (values.image && values.image instanceof File) {
      formData.append('image', values.image);
    }
    values.authors.forEach(author => {
      formData.append('author_ids', author.key);
    });

    try {
      if (data) {
        await fetcherClient<ArticlesBlog>({
          url: `/admin/blog/articles/${data.id}`,
          method: 'PUT',
          body: formData,
        });
      } else {
        await fetcherClient<ArticlesBlog, CreateArticlesAdminBlogBody>({
          url: '/admin/blog/articles',
          method: 'POST',
          body: formData,
        });
      }
      await mutationApi();
      push('/admin/blog/articles');
      toast.success(t(`${data ? 'edit' : 'create'}.success`), {
        description: convertText(values.title),
      });
    } catch (err) {
      const error = err as Error;
      if (error.message.includes('ARTICLE_ALREADY_EXISTS')) {
        form.setError('slug', {
          type: 'manual',
          message: t('create.slug.article_already_exists'),
        });

        return;
      }

      toast.error(tCore('errors.title'), {
        description: tCore('errors.internal_server_error'),
      });
    }
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
          id: 'image',
          label: t('create.image'),
          component: props => (
            <AutoFormFileInput
              {...props}
              accept="image/png, image/jpeg, image/webp"
              acceptExtensions={['png', 'jpg', 'webp']}
              maxFileSizeInMb={2}
              showInfo
            />
          ),
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
