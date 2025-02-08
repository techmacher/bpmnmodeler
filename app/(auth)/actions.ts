
import { signIn } from 'next-auth/react';
import { getUserByEmail, createUser } from '../../lib/db/queries';
import { generateUUID } from '../../lib/db/schema';
import { z } from 'zod';
import { FormState } from '../../lib/types';

// Action States
export interface LoginActionState extends FormState {
  error?: string;
  success?: boolean;
}

export interface RegisterActionState extends FormState {
  error?: string;
  success?: boolean;
}

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Actions
export async function login(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      return {
        error: 'Invalid email or password format',
      };
    }

    const signInResult = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!signInResult?.ok) {
      return {
        error: 'Invalid email or password',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      error: 'An error occurred during login',
    };
  }
}

export async function register(
  prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      return {
        error: 'Invalid registration data',
      };
    }

    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      return {
        error: 'Email already exists',
      };
    }

    await createUser({
      id: generateUUID(),
      name: data.name||'', // Optional
      email: data.email,
      emailVerified: null,
    });

    const signInResult = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!signInResult?.ok) {
      return {
        error: 'Registration successful but login failed',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      error: 'An error occurred during registration',
    };
  }
}

export async function createUserIfNotExists(email: string, name: string) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) return existingUser;

  const newUser = await createUser({
    id: generateUUID(),
    email,
    name:name||'', 
    emailVerified: new Date(),
  });

  return newUser;
}
