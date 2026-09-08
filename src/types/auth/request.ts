import { User } from '../user/request.js';

/**
 * Auth Request Types - Input Data
 */

// Register Request
export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
}

// Login Request
export interface LoginUserRequest {
  email: string;
  password: string;
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Change Password Request
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// JWT Token Payload
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// Auth Response
export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}
