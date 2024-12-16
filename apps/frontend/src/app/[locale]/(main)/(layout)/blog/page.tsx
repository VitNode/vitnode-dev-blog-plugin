import { BlogView } from '@/plugins/blog/templates/blog/blog-view';
import { getMiddlewareData } from 'vitnode-frontend/api/get-middleware-data';
import { redirect } from 'vitnode-frontend/navigation';

export default async function Page() {
  const middleware = await getMiddlewareData();

  if (middleware.plugin_code_default === 'blog') {
    await redirect('/');
  }

  return <BlogView />;
}
