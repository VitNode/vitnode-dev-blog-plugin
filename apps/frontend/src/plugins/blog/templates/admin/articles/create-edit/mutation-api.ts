'use server';

import { revalidatePath } from 'next/cache';

export const mutationApi = async (): Promise<void> => {
  return new Promise<void>(resolve => {
    revalidatePath('/[locale]/admin/(auth)/blog/articles', 'layout');
    resolve();
  });
};
