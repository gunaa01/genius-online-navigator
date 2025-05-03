import { UserRole } from '../utils/auth';

export interface UserBase {
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  isSuperuser: boolean;
  role: UserRole;
}

export interface UserCreate extends Omit<UserBase, 'isActive' | 'isSuperuser' | 'role'> {
  password: string;
  isActive?: boolean;
  isSuperuser?: boolean;
  role?: UserRole;
}

export interface UserUpdate extends Partial<Omit<UserBase, 'email'>> {
  email?: string;
  password?: string;
}

export interface User extends UserBase {
  id: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse extends Omit<User, 'password'> {}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UsersResponse {
  data: UserResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
