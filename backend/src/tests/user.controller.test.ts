import { FastifyInstance } from 'fastify';
import { buildApp } from '../app';
import { UserRole } from '../utils/auth';
import { cleanDatabase, createTestUser, TestUser, loginUser } from './test-utils';

describe('UserController', () => {
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

  describe('GET /api/users', () => {
    it('should return 403 for non-admin users', async () => {
      const { accessToken } = await loginUser(app, testUser.email, 'password123');
      
      const response = await app.inject({
        method: 'GET',
        url: '/api/users',
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });
      
      expect(response.statusCode).toBe(403);
    });

    it('should return users for admin users', async () => {
      const { accessToken } = await loginUser(app, adminUser.email, 'admin123');
      
      const response = await app.inject({
        method: 'GET',
        url: '/api/users',
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });
      
      expect(response.statusCode).toBe(200);
      const { data } = JSON.parse(response.payload);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(2); // At least our test users
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const { accessToken } = await loginUser(app, testUser.email, 'password123');
      
      const response = await app.inject({
        method: 'GET',
        url: `/api/users/${testUser.id}`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });
      
      expect(response.statusCode).toBe(200);
      const user = JSON.parse(response.payload);
      expect(user.id).toBe(testUser.id);
      expect(user.email).toBe(testUser.email);
    });

    it('should return 403 when trying to access another user', async () => {
      const anotherUser = await createTestUser(app, { email: 'another@example.com' });
      const { accessToken } = await loginUser(app, testUser.email, 'password123');
      
      const response = await app.inject({
        method: 'GET',
        url: `/api/users/${anotherUser.id}`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });
      
      expect(response.statusCode).toBe(403);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user information', async () => {
      const { accessToken } = await loginUser(app, testUser.email, 'password123');
      const updates = {
        firstName: 'Updated',
        lastName: 'Name'
      };
      
      const response = await app.inject({
        method: 'PUT',
        url: `/api/users/${testUser.id}`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`
        },
        payload: JSON.stringify(updates)
      });
      
      expect(response.statusCode).toBe(200);
      const user = JSON.parse(response.payload);
      expect(user.firstName).toBe(updates.firstName);
      expect(user.lastName).toBe(updates.lastName);
    });
  });

  describe('POST /api/users/:id/change-password', () => {
    it('should change user password', async () => {
      const { accessToken } = await loginUser(app, testUser.email, 'password123');
      const newPassword = 'newpassword123';
      
      const response = await app.inject({
        method: 'POST',
        url: `/api/users/${testUser.id}/change-password`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`
        },
        payload: JSON.stringify({
          currentPassword: 'password123',
          newPassword
        })
      });
      
      expect(response.statusCode).toBe(204);
      
      // Verify password was changed by trying to log in with new password
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: testUser.email,
          password: newPassword
        }
      });
      
      expect(loginResponse.statusCode).toBe(200);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow admin to delete user', async () => {
      const userToDelete = await createTestUser(app, { email: 'todelete@example.com' });
      const { accessToken } = await loginUser(app, adminUser.email, 'admin123');
      
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/users/${userToDelete.id}`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });
      
      expect(response.statusCode).toBe(204);
      
      // Verify user was deleted
      const checkResponse = await app.inject({
        method: 'GET',
        url: `/api/users/${userToDelete.id}`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      });
      
      expect(checkResponse.statusCode).toBe(404);
    });
  });
});
