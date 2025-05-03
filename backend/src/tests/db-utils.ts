import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:../../prisma/test.db',
    },
  },
});

export async function setupTestDatabase() {
  // Set test database URL
  process.env.DATABASE_URL = 'file:../../prisma/test.db';

  // Run migrations
  execSync('npx prisma migrate reset --force --skip-generate', {
    env: {
      ...process.env,
      DATABASE_URL: 'file:../../prisma/test.db',
    },
    stdio: 'inherit',
  });

  // Seed the database if needed
  // await seedDatabase();
}

export async function teardownTestDatabase() {
  await prisma.$disconnect();
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
