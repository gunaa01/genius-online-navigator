import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create test users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: '$2a$10$X8z5Mv5z5U5Z5X5Z5X5Z5O5X8z5Mv5z5U5Z5X5Z5X5Z5O5X8z5Mv5z5U5Z5X5Z5X5Z5O5', // hashed 'admin123'
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isSuperuser: true,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: '$2a$10$X8z5Mv5z5U5Z5X5Z5X5Z5O5X8z5Mv5z5U5Z5X5Z5X5Z5O5X8z5Mv5z5U5Z5X5Z5X5Z5O5', // hashed 'user123'
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER',
    },
  });

  // Create a team
  const team = await prisma.team.create({
    data: {
      name: 'Development Team',
      description: 'Core development team',
      members: {
        create: [
          { userId: adminUser.id, role: 'admin' },
          { userId: regularUser.id, role: 'member' },
        ],
      },
    },
  });

  // Create an organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Inc',
      description: 'Our main organization',
      members: {
        create: [
          { userId: adminUser.id, role: 'admin' },
          { userId: regularUser.id, role: 'member' },
        ],
      },
    },
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
