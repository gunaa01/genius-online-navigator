import { Prisma, PrismaClient, User as PrismaUser } from '@prisma/client';
import { User, UserCreate, UserUpdate, UserResponse, UserQueryParams } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/auth';
import { NotFoundError, ValidationError } from '../utils/errors';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export class UserService {
  /**
   * Get all users with pagination and filtering
   */
  static async getUsers(query: UserQueryParams = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const where: Prisma.UserWhereInput = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: this.userSelectFields()
      }),
      prisma.user.count({ where })
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a single user by ID
   */
  static async getUserById(id: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: this.userSelectFields()
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Create a new user with hashed password
   */
  static async createUser(userData: UserCreate): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        isActive: userData.isActive ?? true,
        isSuperuser: userData.isSuperuser ?? false,
        role: 'USER' // Default role
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        isSuperuser: true,
        role: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  }

  /**
   * Update user information
   */
  static async updateUser(id: string, data: UserUpdate): Promise<UserResponse> {
    // Don't allow updating password here
    const { password, ...updateData } = data;
    
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: this.userSelectFields()
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('User not found');
        }
        if (error.code === 'P2002') {
          throw new ValidationError('Email already in use');
        }
      }
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(
    id: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { password: true }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new ValidationError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }

  /**
   * Delete a user
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundError('User not found');
        }
      }
      throw error;
    }
  }

  /**
   * Get user by email (for internal use)
   */
  private static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        isActive: true,
        isSuperuser: true,
        role: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }



  /**
   * Helper method for consistent user selection fields
   */
  private static userSelectFields() {
    return {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      isSuperuser: true,
      role: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    };
  }

  /**
   * Verify user password
   */
  static async verifyPassword(user: any, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  /**
   * Update user last login timestamp
   */
  static async updateLastLogin(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() }
    });
  }

  /**
   * Generate tokens for user
   */
  static async generateAuthTokens(user: any) {
    return generateTokens({
      id: user.id,
      email: user.email,
      role: user.role
    });
  }
}

export default UserService;
