import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { 
  generateToken, 
  verifyToken, 
  authenticate, 
  authorize, 
  handleTokenRefresh,
  generateTokens
} from './auth';
import { envVars } from '../config/env';
import { PrismaClient } from '@prisma/client';

// Mock dependencies
vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: vi.fn(),
      update: vi.fn()
    }
  };
  return { 
    PrismaClient: vi.fn(() => mockPrismaClient)
  };
});

vi.mock('../config/env', () => ({
  envVars: {
    JWT_SECRET: 'test-jwt-secret-key-for-testing-purposes-only',
    REFRESH_SECRET: 'test-refresh-secret-key-for-testing-purposes-only'
  }
}));

describe('Authentication Utilities', () => {
  let mockRequest: any;
  let mockReply: any;
  let mockPrisma: any;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock Fastify request and reply
    mockRequest = {
      headers: {},
      user: undefined
    };
    
    mockReply = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    };
    
    // Get the mocked Prisma instance
    mockPrisma = new PrismaClient();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = { id: '123', email: 'test@example.com', role: 'USER' as const };
      const token = generateToken(user);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Verify token can be decoded
      const decoded = jwt.verify(token, envVars.JWT_SECRET) as any;
      expect(decoded.userId).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });
    
    it('should set the correct expiration time', () => {
      const user = { id: '123', email: 'test@example.com', role: 'USER' as const };
      const expiresIn = '5m';
      const token = generateToken(user, expiresIn);
      
      const decoded = jwt.verify(token, envVars.JWT_SECRET) as any;
      
      // Check that expiration is set (approximately 5 minutes from now)
      const now = Math.floor(Date.now() / 1000);
      expect(decoded.exp).toBeGreaterThan(now);
      expect(decoded.exp).toBeLessThanOrEqual(now + 5 * 60 + 5); // 5 minutes + 5 seconds buffer
    });
    
    it('should throw validation error for invalid user data', () => {
      const invalidUser = { id: '', email: 'test@example.com', role: 'USER' as const };
      expect(() => generateToken(invalidUser)).toThrow();
    });
  });
  
  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const user = { id: '123', email: 'test@example.com', role: 'USER' as const };
      const token = generateToken(user);
      
      const payload = verifyToken(token);
      
      expect(payload).toBeDefined();
      expect(payload.userId).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.role).toBe(user.role);
    });
    
    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });
    
    it('should throw error for expired token', () => {
      // Create a token that's already expired
      const user = { id: '123', email: 'test@example.com', role: 'USER' as const };
      const expiredToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        envVars.JWT_SECRET,
        { expiresIn: '-10s' } // Expired 10 seconds ago
      );
      
      expect(() => verifyToken(expiredToken)).toThrow(/expired/i);
    });
  });
  
  describe('authenticate middleware', () => {
    it('should set user on request when valid token is provided', async () => {
      const user = { id: '123', email: 'test@example.com', role: 'USER' as const };
      const token = generateToken(user);
      
      mockRequest.headers.authorization = `Bearer ${token}`;
      
      await authenticate(mockRequest, mockReply);
      
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user.userId).toBe(user.id);
      expect(mockRequest.user.email).toBe(user.email);
      expect(mockRequest.user.role).toBe(user.role);
      expect(mockReply.code).not.toHaveBeenCalled();
    });
    
    it('should return 401 when no token is provided', async () => {
      await authenticate(mockRequest, mockReply);
      
      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringMatching(/authorization/i)
      }));
    });
    
    it('should return 401 when invalid token is provided', async () => {
      mockRequest.headers.authorization = 'Bearer invalid-token';
      
      await authenticate(mockRequest, mockReply);
      
      expect(mockReply.code).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringMatching(/invalid/i)
      }));
    });
  });
  
  describe('authorize middleware', () => {
    beforeEach(() => {
      // Set up authenticated user
      mockRequest.user = {
        userId: '123',
        email: 'test@example.com',
        role: 'EDITOR'
      };
    });
    
    it('should allow access when user has the required role', async () => {
      const middleware = authorize('EDITOR');
      
      await middleware(mockRequest, mockReply);
      
      expect(mockReply.code).not.toHaveBeenCalled();
    });
    
    it('should allow access when user has a higher role', async () => {
      mockRequest.user.role = 'ADMIN';
      const middleware = authorize('EDITOR');
      
      await middleware(mockRequest, mockReply);
      
      expect(mockReply.code).not.toHaveBeenCalled();
    });
    
    it('should deny access when user has a lower role', async () => {
      mockRequest.user.role = 'USER';
      const middleware = authorize('ADMIN');
      
      await middleware(mockRequest, mockReply);
      
      expect(mockReply.code).toHaveBeenCalledWith(403);
    });
    
    it('should handle array of roles', async () => {
      mockRequest.user.role = 'USER';
      const middleware = authorize(['USER', 'EDITOR']);
      
      await middleware(mockRequest, mockReply);
      
      expect(mockReply.code).not.toHaveBeenCalled();
    });
    
    it('should deny access when user is not authenticated', async () => {
      mockRequest.user = undefined;
      const middleware = authorize('USER');
      
      await middleware(mockRequest, mockReply);
      
      expect(mockReply.code).toHaveBeenCalledWith(401);
    });
  });
  
  describe('handleTokenRefresh', () => {
    it('should generate new tokens for valid refresh token', async () => {
      const user = { 
        id: '123', 
        email: 'test@example.com', 
        role: 'USER' as const,
        isActive: true,
        refreshToken: 'valid-refresh-token'
      };
      
      // Mock JWT verify to return a valid payload
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => ({
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) + 3600
      }));
      
      // Mock Prisma to return the user
      mockPrisma.user.findUnique.mockResolvedValueOnce(user);
      mockPrisma.user.update.mockResolvedValueOnce(user);
      
      const result = await handleTokenRefresh('valid-refresh-token');
      
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.tokenType).toBe('Bearer');
      
      // Verify Prisma was called correctly
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
        select: expect.objectContaining({
          id: true,
          email: true,
          role: true,
          isActive: true,
          refreshToken: true
        })
      });
      
      // Verify refresh token was updated
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: expect.objectContaining({
          refreshToken: expect.any(String)
        })
      });
    });
    
    it('should throw error for invalid refresh token', async () => {
      // Mock JWT verify to throw an error
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      await expect(handleTokenRefresh('invalid-token')).rejects.toThrow();
    });
    
    it('should throw error when user is not found', async () => {
      // Mock JWT verify to return a valid payload
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => ({
        userId: '999',
        email: 'notfound@example.com',
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) + 3600
      }));
      
      // Mock Prisma to return null (user not found)
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      
      await expect(handleTokenRefresh('valid-token-unknown-user')).rejects.toThrow(/not found/i);
    });
    
    it('should throw error when user is inactive', async () => {
      const inactiveUser = { 
        id: '123', 
        email: 'inactive@example.com', 
        role: 'USER' as const,
        isActive: false,
        refreshToken: 'valid-refresh-token'
      };
      
      // Mock JWT verify to return a valid payload
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => ({
        userId: inactiveUser.id,
        email: inactiveUser.email,
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) + 3600
      }));
      
      // Mock Prisma to return the inactive user
      mockPrisma.user.findUnique.mockResolvedValueOnce(inactiveUser);
      
      await expect(handleTokenRefresh('valid-token-inactive-user')).rejects.toThrow(/not active/i);
    });
    
    it('should throw error when refresh token does not match', async () => {
      const user = { 
        id: '123', 
        email: 'test@example.com', 
        role: 'USER' as const,
        isActive: true,
        refreshToken: 'stored-refresh-token'
      };
      
      // Mock JWT verify to return a valid payload
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => ({
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) + 3600
      }));
      
      // Mock Prisma to return the user
      mockPrisma.user.findUnique.mockResolvedValueOnce(user);
      
      await expect(handleTokenRefresh('different-refresh-token')).rejects.toThrow(/invalid refresh token/i);
    });
  });
});
