import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string | null;
    };
    expires: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image: string | null;
    emailVerified: Date | null;
    createdAt: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image: string | null;
  }
}

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request }: { auth: { user?: { id: string; }; } | null; request: NextRequest; }) {
      const isLoggedIn = !!auth?.user;
      const nextUrl = new URL(request.url);
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnChat = nextUrl.pathname.startsWith('/chat');

      if (isOnDashboard || isOnChat) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: { id: string; email: string; name: string; image: string | null; }; }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: { user?: { id: string; email: string; name: string; image: string | null; }; expires: string; }; token: JWT; }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  providers: [], // configured in auth.ts
} as unknown as NextAuthOptions;

export type AuthConfig = typeof authConfig;
