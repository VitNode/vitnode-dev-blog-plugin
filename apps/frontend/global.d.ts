import type core from '@/plugins/core/langs/en.json';
import type admin from '@/plugins/admin/langs/en.json';
import type blog from '@/plugins/blog/langs/en.json';

type Messages = typeof core & typeof admin & typeof blog;

declare global {
  interface IntlMessages extends Messages {}
}
