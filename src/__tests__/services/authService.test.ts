import axios from 'axios';
import authService from '@/services/authService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock JWT token for testing
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = {
        data: {
          access_token: mockToken,
          token_type: 'bearer',
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
          },
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );

      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
    });

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials';
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: errorMessage,
          },
          status: 401,
        },
      });

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toEqual({
        response: {
          data: {
            message: errorMessage,
          },
          status: 401,
        },
      });

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    it('should register successfully and store token', async () => {
      const mockResponse = {
        data: {
          access_token: mockToken,
          token_type: 'bearer',
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
          },
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }
      );

      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage and axios headers', () => {
      // Set up initial state
      localStorage.setItem('token', mockToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

      // Logout
      authService.logout();

      // Check token was removed
      expect(localStorage.getItem('token')).toBeNull();
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true for valid non-expired token', () => {
      localStorage.setItem('token', mockToken);
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return false for invalid token', () => {
      localStorage.setItem('token', 'invalid-token');
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user data from valid token', () => {
      localStorage.setItem('token', mockToken);
      const user = authService.getCurrentUser();
      
      expect(user).toEqual({
        id: '1234567890',
        email: 'test@example.com',
        firstName: '',
        lastName: '',
        role: 'user',
      });
    });

    it('should return null when no token exists', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });
  });

  describe('getUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await authService.getUserProfile();
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/auth/me'));
      expect(result).toEqual(mockUser);
    });
  });

  describe('axios interceptors', () => {
    it('should add Authorization header to requests when token exists', () => {
      // Set up initial state
      localStorage.setItem('token', mockToken);
      
      // Trigger interceptor by creating a request config
      const config = {};
      const interceptor = axios.interceptors.request.use.mock.calls[0][0];
      const result = interceptor(config);
      
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('should not add Authorization header when token does not exist', () => {
      // Trigger interceptor by creating a request config
      const config = {};
      const interceptor = axios.interceptors.request.use.mock.calls[0][0];
      const result = interceptor(config);
      
      expect(result.headers?.Authorization).toBeUndefined();
    });
  });
});
