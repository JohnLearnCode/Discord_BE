import bcrypt from 'bcryptjs';
import User, { IUserDoc } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginUserRequest,
  RegisterUserRequest,
} from '../types/index.js';

const SALT_ROUNDS = 10;

const authService = {
  async register(data: RegisterUserRequest): Promise<AuthResponse> {
    const existingUser = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });

    if (existingUser) {
      throw new ApiError(409, 'Username or email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await User.create({
      username: data.username,
      email: data.email,
      passwordHash,
    });

    return this.generateAuthResponse(user);
  },

  async login(data: LoginUserRequest): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    return this.generateAuthResponse(user);
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    return this.generateAuthResponse(user);
  },

  async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.oldPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(400, 'Old password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
    await user.save();
  },

  async generateAuthResponse(user: IUserDoc): Promise<AuthResponse> {
    return {
      user: user.toJSON(),
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    };
  },
};

export default authService;
