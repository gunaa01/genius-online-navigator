import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config();

// Define environment variable schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string().min(32).describe('Secret key for signing JWT tokens'),
  REFRESH_SECRET: z.string().min(32).describe('Secret key for signing refresh tokens'),
  REDIS_URL: z.string().optional().describe('Redis connection URL for rate limiting'),
  DATABASE_URL: z.string().url().describe('Database connection URL'),
  CORS_ORIGIN: z.string().default('*').describe('Allowed CORS origins'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').describe('Rate limit window in milliseconds'),
  RATE_LIMIT_MAX: z.string().default('100').describe('Max requests per window per IP')
});

type Env = z.infer<typeof envSchema>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends Env {}
  }
}

// Validate environment variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(env.error.format(), null, 2));
  process.exit(1);
}

// Export validated environment variables
export const envVars = env.data;
