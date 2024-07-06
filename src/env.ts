import { z } from 'zod';

const parsed = z
  .object({
    NODE_ENV: z.enum(['development', 'production']),
    VITE_APP_URL: z.string(),
  })
  .safeParse(import.meta.env ?? process.env);

if (parsed.error) {
  for (const err of parsed.error.errors) {
    const path = (err.path[0] ?? '') as string;
    if (path.startsWith('VITE_')) {
      throw new Error(`Missing environment variable: ${path}`);
    }
    if (typeof window === 'undefined' && !import.meta.env?.SSR) {
      throw new Error(`Missing environment variable: ${path}`);
    }
  }
}

type StripUndefinedFields<T> = {
  [P in keyof T]-?: StripUndefinedFields<NonNullable<T[P]>>;
};

export const env: StripUndefinedFields<typeof parsed>['data'] = (import.meta
  .env ?? process.env) as any;
