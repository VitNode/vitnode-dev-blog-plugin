// ! DO NOT TOUCH THIS FILE!!! IT IS GENERATED BY VITNODE-CLI
import React from 'react';
import {
  AdminLayout,
  generateMetadataAdminLayout,
} from 'vitnode-frontend/views/admin/layout/admin-layout';

export const generateMetadata = generateMetadataAdminLayout;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
