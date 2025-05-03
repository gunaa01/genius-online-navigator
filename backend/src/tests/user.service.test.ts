import { FastifyInstance } from 'fastify';
import { buildApp } from '../app';
import { UserService } from '../services/user.service';
import { UserRole } from '../utils/auth';
import { cleanDatabase, createTestUser, TestUser } from './test-utils';

describe('UserService', () => {
  let app: FastifyInstance;
  let testUser: TestUser;

  beforeAll(async () => {
    app = await buildApp({ logger: false });
    await cleanDatabase();
    testUser = await createTestUser(app);
  });

  afterAll(async () => {
    await cleanDatabase();
    await app.close();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      // Create some test users
      await createTestUser(app, { email: 'user1@example.com' });
      await createTestUser(app, { email: 'user2@example.com' });

      const result = await UserService.getUsers({ page: 1, limit: 2 });
      
      expect(result.data.length).toBe(2);
      expect(result.meta.total).toBeGreaterThanOrEqual(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(2);
    });

    it('should filter users by role', async () => {
      await createTestUser(app, { email: 'admin@example.com', role: UserRole.ADMIN });
      
      const result = await UserService.getUsers({ role: UserRole.ADMIN });
      
      expect(result.data.length).toBe(1);
      expect(result.data[0].email).toBe('admin@example.com');
      expect(result.data[0].role).toBe(UserRole.ADMIN);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const user = await UserService.getUserById(testUser.id);
      
      expect(user).toBeDefined();
      expect(user.id).toBe(testUser.id);
      expect(user.email).toBe(testUser.email);
    });

    it('should throw error for non-existent user', async () => {
      await expect(UserService.getUserById('non-existent-id')).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        isActive: true
      };

      const user = await UserService.createUser(userData);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.isActive).toBe(true);
      expect(user.password).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update user information', async () => {
      const updates = {
        firstName: 'Updated',
        lastName: 'Name',
        isActive: false
      };

      const updatedUser = await UserService.updateUser(testUser.id, updates);
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser.firstName).toBe(updates.firstName);
      expect(updatedUser.lastName).toBe(updates.lastName);
      expect(updatedUser.isActive).toBe(updates.isActive);
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const newPassword = 'newpassword123';
      
      await UserService.updatePassword(
        testUser.id,
        testUser.password, // current password
        newPassword
      );

      // Verify password was changed by trying to log in
      const user = await UserService['getUserByEmail'](testUser.email);
      const isValid = await app.bcrypt.compare(newPassword, user!.password);
      
      expect(isValid).toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userToDelete = await createTestUser(app, { email: 'todelete@example.com' });
      
      await UserService.deleteUser(userToDelete.id);
      
      // Verify user was deleted
      await expect(UserService.getUserById(userToDelete.id)).rejects.toThrow('User not found');
    });
  });
});
