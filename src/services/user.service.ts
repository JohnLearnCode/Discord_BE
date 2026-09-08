import bcrypt from 'bcryptjs';
import User, { IUserDocument } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { CreateUserRequest, UpdateUserRequest } from '../types/index.js';

const SALT_ROUNDS = 10;

const userService = {
  async getAllUsers(): Promise<IUserDocument[]> {
    return User.find().select('-passwordHash');
  },

  async getUserById(id: string): Promise<IUserDocument> {
    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  async findUserByUsername(username: string): Promise<IUserDocument> {
    const user = await User.findOne({ username }).select('-passwordHash');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  async createUser(data: CreateUserRequest): Promise<IUserDocument> {
    const existingUser = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });

    if (existingUser) {
      throw new ApiError(409, 'Username or email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    return User.create({
      username: data.username,
      email: data.email,
      passwordHash,
    });
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<IUserDocument> {
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  },

  async deleteUser(id: string): Promise<IUserDocument> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },
};

export default userService;
