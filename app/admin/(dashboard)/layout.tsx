import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AdminLayoutShell from '../components/AdminLayoutShell';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { SnackbarProvider } from '../components/SnackbarProvider';
import { ConfirmProvider } from '../components/ConfirmProvider';

import { redirect } from 'next/navigation';

export const metadata = {
  title: 'SetEvent Admin Panel',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }
  
  return (
    <AppRouterCacheProvider>
      <ConfirmProvider>
        <SnackbarProvider>
          <AdminLayoutShell userName={session?.user?.name}>
            {children}
          </AdminLayoutShell>
        </SnackbarProvider>
      </ConfirmProvider>
    </AppRouterCacheProvider>
  );
}
