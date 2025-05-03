import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { cleanDatabase } from './test-utils';

// Mock external services if needed
vi.mock('nodemailer', () => ({
  createTransport: vi.fn().mockReturnValue({
    sendMail: vi.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  }),
}));

// Clean database before all tests and after each test
beforeAll(async () => {
  await cleanDatabase();
});

afterEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  // Clean up any resources if needed
});

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-token-secret';
process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
process.env.DATABASE_URL = 'file:./test.db';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.APP_URL = 'http://localhost:3000';
process.env.APP_NAME = 'Test App';
