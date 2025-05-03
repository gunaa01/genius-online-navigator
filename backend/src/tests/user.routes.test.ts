import { FastifyInstance } from 'fastify';
import { buildApp } from '../app';
import { UserRole } from '../utils/auth';
import { cleanDatabase, createTestUser, TestUser, loginUser } from './test-utils';

describe('User Routes', () => {
  let app: FastifyInstance;
  let testUser: TestUser;
  let adminUser: TestUser;

  beforeAll(async () => {
    app = await buildApp({ logger: false });
    await cleanDatabase();
    
    // Create test users
    testUser = await createTestUser(app, {
      email: 'testuser@example.com',
      password: 'password123',
      role: UserRole.USER
    });
    
    adminUser = await createTestUser(app, {
      email: 'admin@example.com',
      password: 'admin123',
      role: UserRole.ADMIN,
      isSuperuser: true
    });
  });

  afterAll(async () => {
    await cleanDatabase();
    await app.close();
  });

  describe('GET /api/users/me', () => {
    it('should return current user profile', async () => {
      const { accessToken } = await loginUser(app, testUser.email, 'password123');
      
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/me',
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });
      
      expect(response.statusCode).toBe(200);
      const user = JSON.parse(response.payload);
      expect(user.id).toBe(testUser.id);
      expect(user.email).toBe(testUser.email);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/me'
      });
      
      expect(response.statusCode).toBe(401);
    });
  });

  describe('User Registration', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };
      
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: userData
      });
      
      expect(response.statusCode).toBe(201);
      const { user, accessToken, refreshToken } = JSON.parse(response.payload);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('should return 400 for invalid registration data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'invalid-email',
          password: 'short'
        }
      });
      
      expect(response.statusCode).toBe(400);
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: testUser.email,
          password: 'password123'
        }
      });
      
      expect(response.statusCode).toBe(200);
      const { user, accessToken, refreshToken } = JSON.parse(response.payload);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: testUser.email,
          password: 'wrong-password'
        }
      });
      
      expect(response.statusCode).toBe(401);
    });
  });

  describe('User Management (Admin)', () => {
    it('should allow admin to update user role', async () => {
      const { accessToken } = await loginUser(app, adminUser.email, 'admin123');
      
      const response = await app.inject({
        method: 'PUT',
        url: `/api/users/${testUser.id}`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`
        },
        payload: JSON.stringify({
          role: UserRole.MODERATOR
        })
      });
      
      expect(response.statusCode).toBe(200);
      const user = JSON.parse(response.payload);
      expect(user.role).toBe(UserRole.MODERATOR);
    });

    it('should prevent non-admin from updating user role', async () => {
      const regularUser = await createTestUser(app, { email: 'regular@example.com' });
      const { accessToken } = await loginUser(app, regularUser.email, 'password123');
      
      const response = await app.inject({
        method: 'PUT',
        url: `/api/users/${testUser.id}`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`
        },
        payload: JSON.stringify({
          role: UserRole.MODERATOR
        })
      });
      
      expect(response.statusCode).toBe(403);
    });
  });
});
