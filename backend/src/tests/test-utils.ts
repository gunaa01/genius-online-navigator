import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { UserRole } from '../utils/auth';
import { buildApp } from '../app';

const prisma = new PrismaClient();

// Helper to get a test app instance
export async function getTestApp(): Promise<FastifyInstance> {
  return await buildApp();
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  isSuperuser: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export async function createTestUser(
  app: FastifyInstance,
  userData: Partial<TestUser> = {}
): Promise<TestUser> {
  const defaultUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    role: UserRole.USER,
    isActive: true,
    isSuperuser: false,
    ...userData
  };

  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: defaultUser.email,
      password: 'hashed_password', // Simplified for tests
      role: defaultUser.role,
      isActive: defaultUser.isActive,
      isSuperuser: defaultUser.isSuperuser
    }
  });

  // Generate a mock token
  const accessToken = app.jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return {
    ...defaultUser,
    id: user.id,
    accessToken,
    refreshToken: 'mock-refresh-token'
  };
}

export async function cleanDatabase() {
  const tables = ['User', 'RefreshToken'];
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
    } catch (error) {
      console.error(`Error cleaning table ${table}:`, error);
    }
  }
}

export async function loginUser(
  app: FastifyInstance,
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email, password }
  });

  const { accessToken, refreshToken } = JSON.parse(response.payload);
  return { accessToken, refreshToken };
}
