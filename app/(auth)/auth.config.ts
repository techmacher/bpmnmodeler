import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [],
  callbacks: {
    authorized({ request: { nextUrl } }) {
      // For development, allow access to all routes
      return true;
    },
  },
} satisfies NextAuthConfig;
