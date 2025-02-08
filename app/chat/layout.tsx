import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { authConfig } from '@/app/(auth)/auth';
import Script from 'next/script';
import { ChatSidebar } from '@/components/chat-sidebar';
import {getServerSession} from 'next-auth/next';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const [ cookieStore] = await Promise.all([cookies()]);
  const session = await getServerSession(authConfig);
  // console.log('Cookie state:', cookieStore.get('sidebar:state'));
  
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'false';
  // console.log('isCollapsed:', isCollapsed);
  const user = {
    ...session?.user,
    id: session?.user?.id || 'default-id', // Provide a default value for id
    email: session?.user?.email || 'default-email@example.com', // Provide a default value for email
    name: session?.user?.name || 'Default User', // Provide a default value for name
    image: '',
    emailVerified: null,
    createdAt: new Date(),
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
