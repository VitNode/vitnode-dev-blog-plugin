import { revalidatePath, revalidateTag } from 'next/cache';

export const revalidateCategoryApi = ({
  slug,
  prevSlug,
}: {
  prevSlug?: string;
  slug: string;
}) => {
  revalidatePath('/[locale]/admin/(auth)/blog/articles', 'layout');
  revalidatePath('/[locale]/admin/(auth)/blog/categories', 'page');
  revalidatePath('/[locale]/(main)/(layout)/blog', 'page');
  revalidatePath('/[locale]/(main)/(layout)', 'page');
  revalidateTag(`blog_articles__${slug}`);
  if (prevSlug) {
    revalidateTag(`blog_articles__${prevSlug}`);
  }
};
