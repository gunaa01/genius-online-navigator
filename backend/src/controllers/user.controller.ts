import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import {
  UserCreate,
  UserUpdate,
  UserResponse,
  LoginResponse,
  ChangePasswordInput,
  UsersResponse,
  UserQueryParams
} from '../interfaces/user.interface';
import { AuthenticationError, ValidationError, ForbiddenError } from '../utils/errors';

export class UserController {
  /**
   * Get all users (admin only)
   */
  static async getUsers(
    request: FastifyRequest<{ Querystring: UserQueryParams }>,
    reply: FastifyReply
  ) {
    try {
      // Only allow admins to list users
      if (!request.user.isSuperuser) {
        throw new ForbiddenError('Not authorized');
      }

      const users = await UserService.getUsers(request.query);
      return reply.send(users);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return reply.status(403).send({ error: error.message });
      }
      console.error('Get users error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * Get a single user by ID
   */
  static async getUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      // Users can only view their own profile unless they're admins
      if (request.user.id !== request.params.id && !request.user.isSuperuser) {
        throw new ForbiddenError('Not authorized to view this user');
      }

      const user = await UserService.getUserById(request.params.id);
      return reply.send(user);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return reply.status(403).send({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return reply.status(400).send({ error: error.message });
      }
      console.error('Get user error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
  /**
   * Register a new user
   */
  static async register(
    request: FastifyRequest<{ Body: UserCreate }>,
    reply: FastifyReply
  ) {
    try {
      // Check if user already exists
      const existingUser = await UserService.getUserByEmail(request.body.email);
      if (existingUser) {
        throw new ValidationError('Email already registered');
      }

      // Create new user
      const user = await UserService.createUser(request.body);
      
      // Generate tokens
      const tokens = await UserService.generateAuthTokens(user);
      
      // Update last login
      await UserService.updateLastLogin(user.id);

      const response: LoginResponse = {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };

      return reply.status(201).send(response);
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(400).send({ error: error.message });
      }
      console.error('Registration error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * User login
   */
  static async login(
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;

      // Find user by email
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await UserService.verifyPassword(user, password);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError('User account is not active');
      }

      // Generate tokens
      const tokens = await UserService.generateAuthTokens(user);
      
      // Update last login
      await UserService.updateLastLogin(user.id);

      const response: LoginResponse = {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          isSuperuser: user.isSuperuser,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };

      return reply.send(response);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return reply.status(401).send({ error: error.message });
      }
      console.error('Login error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(
    request: FastifyRequest<{ Params: { id: string }; Body: UserUpdate }>,
    reply: FastifyReply
  ) {
    try {
      // Users can only update their own profile unless they're admins
      if (request.user.id !== request.params.id && !request.user.isSuperuser) {
        throw new ForbiddenError('Not authorized to update this user');
      }

      // Only admins can change role or superuser status
      if (!request.user.isSuperuser) {
        delete request.body.role;
        delete request.body.isSuperuser;
      }

      const updatedUser = await UserService.updateUser(request.params.id, request.body);
      return reply.send(updatedUser);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return reply.status(403).send({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return reply.status(400).send({ error: error.message });
      }
      console.error('Update user error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * Change user password
   */
  static async changePassword(
    request: FastifyRequest<{ Params: { id: string }; Body: ChangePasswordInput }>,
    reply: FastifyReply
  ) {
    try {
      // Users can only change their own password unless they're admins
      if (request.user.id !== request.params.id && !request.user.isSuperuser) {
        throw new ForbiddenError('Not authorized to change this password');
      }

      await UserService.updatePassword(
        request.params.id,
        request.body.currentPassword,
        request.body.newPassword
      );

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return reply.status(403).send({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return reply.status(400).send({ error: error.message });
      }
      console.error('Change password error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * Delete a user
   */
  static async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      // Only admins can delete users
      if (!request.user.isSuperuser) {
        throw new ForbiddenError('Not authorized to delete users');
      }

      // Prevent self-deletion
      if (request.user.id === request.params.id) {
        throw new ValidationError('Cannot delete your own account');
      }

      await UserService.deleteUser(request.params.id);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return reply.status(403).send({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return reply.status(400).send({ error: error.message });
      }
      console.error('Delete user error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      // Get fresh user data from database
      const userData = await UserService.getUserById(request.user.id);
      return reply.send(userData);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return reply.status(401).send({ error: error.message });
      }
      console.error('Get profile error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}

export default UserController;
