import NextAuth from 'next-auth';
import {authHandler} from '../../../auth';
const handler = authHandler;

export { handler as GET, handler as POST };
