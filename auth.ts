import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from '@/app/(auth)/auth.config';
import { getUserByEmail } from '@/lib/db/queries';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession as nextAuthUseSession} from 'next-auth/react';
import { getServerSession } from 'next-auth/next';

// For development, provide a default user session
const defaultUser = {
  id: '4ca743fc-03aa-4b55-ba34-34bc101d7792',
  name: 'Default User',
  email: 'nathan@machers.tech',
};
const myAuthConfig = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const user = await getUserByEmail(credentials.email);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        };
      },
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }: { session: any, token: any }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user, account, profile }: { token: any, user?: any, account?: any, profile?: any }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
};
const handler = NextAuth(myAuthConfig);
// Server-side session retrieval function
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, myAuthConfig)
}
export { handler as authHandler, myAuthConfig as authConfig, nextAuthSignIn as signIn, nextAuthSignOut as signOut, nextAuthUseSession as useSession };