import { revalidatePath, revalidateTag } from 'next/cache';

export const revalidateArticleApi = ({
  slug,
  categorySlug,
  prevSlug,
}: {
  categorySlug: string;
  prevSlug?: string;
  slug: string;
}) => {
  revalidatePath('/[locale]/admin/(auth)/blog/articles', 'page');
  revalidatePath('/[locale]/(main)/(layout)/blog', 'page');
  revalidatePath('/[locale]/(main)/(layout)', 'page');
  revalidateTag(`blog_articles__${categorySlug}`);
  revalidateTag(`blog_articles__${categorySlug}_${slug}`);
  if (prevSlug && prevSlug !== slug) {
    revalidateTag(`blog_articles__${categorySlug}_${prevSlug}`);
  }
  revalidatePath('/[locale]/admin/(auth)/blog/articles/edit/[id]', 'page');
};
