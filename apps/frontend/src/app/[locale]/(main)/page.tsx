import { BlogView } from '@/plugins/blog/templates/blog/blog-view';
import React from 'react';
import { generateMetadataDefaultPage } from 'vitnode-frontend/views/theme/views/default-page';

export const generateMetadata = generateMetadataDefaultPage;

export default function Page() {
  return <BlogView />;
}
