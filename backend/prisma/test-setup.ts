import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import { URL } from 'url';

const prismaBinary = join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'prisma.cmd' : 'prisma'
);

const testDatabaseUrl = 'file:./test.db';

const prisma = new PrismaClient({
  datasources: { db: { url: testDatabaseUrl } },
});

export async function setupTestDatabase() {
  // Set the test database URL for Prisma
  process.env.DATABASE_URL = testDatabaseUrl;

  try {
    // Run migrations on the test database
    execSync(`${prismaBinary} migrate deploy --schema=./prisma/test.prisma`, {
      stdio: 'inherit',
    });

    console.log('✅ Test database migrated successfully');
  } catch (error) {
    console.error('❌ Failed to migrate test database');
    process.exit(1);
  }
}

export async function teardownTestDatabase() {
  try {
    // Clean up test database
    await prisma.$executeRaw`DROP TABLE IF EXISTS \`User\`;`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS \`RefreshToken\`;`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS \`_prisma_migrations\`;`;
    
    console.log('✅ Test database cleaned up');
  } catch (error) {
    console.error('❌ Failed to clean up test database');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupTestDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
