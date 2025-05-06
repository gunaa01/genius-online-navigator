import request from 'supertest';
import { buildTestApp } from '../src/test-app';
import { PrismaClient } from '@prisma/client';

describe('Content Generation API', () => {
  let app: Awaited<ReturnType<typeof buildTestApp>>;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    app = await buildTestApp();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should return generated content for a user', async () => {
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    // Generate a test token
    const token = app.jwt.sign({ id: testUser.id });

    const res = await request(app.server)
      .get('/api/content')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create new generated content', async () => {
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test2@example.com',
        name: 'Test User 2',
      },
    });

    // Generate a test token
    const token = app.jwt.sign({ id: testUser.id });

    const res = await request(app.server)
      .post('/api/content')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        title: 'Test', 
        body: 'Test body', 
        status: 'draft' 
      });
      
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
