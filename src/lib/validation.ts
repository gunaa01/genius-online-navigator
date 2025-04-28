import { z } from "zod";

/**
 * Common validation schemas and utilities
 */
export const schemas = {
  login: () => z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  }),
  email: () => z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: () => z.string().min(8, 'Password must contain at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter'),
  urlPath: () => z.string().min(1, 'Path is required')
    .startsWith('/', 'Path must start with /')
};

export function formatErrors(errors: z.ZodIssue[]) {
  return errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }));
}

export function validate<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: formatErrors(result.error.errors) };
  }
  return { success: true, data: result.data };
}
