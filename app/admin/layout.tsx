import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AdminLayoutShell from './components/AdminLayoutShell';

export const metadata = {
  title: 'SetEvent Admin Panel',
};

import { SnackbarProvider } from './components/SnackbarProvider';
import { ConfirmProvider } from './components/ConfirmProvider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  return (
    <ConfirmProvider>
      <SnackbarProvider>
        <AdminLayoutShell userName={session?.user?.name}>
          {children}
        </AdminLayoutShell>
      </SnackbarProvider>
    </ConfirmProvider>
  );
}
