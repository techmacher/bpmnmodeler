import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// For development, provide a default user session
const defaultUser = {
  id: 'default-user',
  name: 'Default User',
  email: 'user@example.com',
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [],
  callbacks: {
    async session({ session }) {
      // Always return the default user session for development
      return {
        ...session,
        user: defaultUser,
      };
    },
    async jwt({ token }) {
      // Add default user ID to the token
      token.id = defaultUser.id;
      return token;
    },
  },
});
