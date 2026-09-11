import FriendshipModel, { IFriendshipDocument } from '../models/friendship.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import {
  CreateFriendshipRequest,
  FriendshipStatus,
  UpdateFriendshipRequest,
} from '../types/index.js';

const friendshipService = {
  async getAllFriendships(): Promise<IFriendshipDocument[]> {
    return FriendshipModel.find()
      .populate('senderId', 'username email avatarUrl')
      .populate('receiverId', 'username email avatarUrl');
  },

  async getFriendshipById(id: string): Promise<IFriendshipDocument> {
    const friendship = await FriendshipModel.findById(id)
      .populate('senderId', 'username email avatarUrl')
      .populate('receiverId', 'username email avatarUrl');
    if (!friendship) {
      throw new ApiError(404, 'Friendship not found');
    }
    return friendship;
  },

  async getFriendshipsByUser(userId: string): Promise<IFriendshipDocument[]> {
    return FriendshipModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate('senderId', 'username email avatarUrl')
      .populate('receiverId', 'username email avatarUrl');
  },

  async sendFriendRequest(data: CreateFriendshipRequest): Promise<IFriendshipDocument> {
    if (data.senderId === data.receiverId) {
      throw new ApiError(400, 'Cannot send friend request to yourself');
    }

    const existing = await FriendshipModel.findOne({
      $or: [
        { senderId: data.senderId, receiverId: data.receiverId },
        { senderId: data.receiverId, receiverId: data.senderId },
      ],
    });

    if (existing) {
      throw new ApiError(409, 'Friend request already exists');
    }

    return FriendshipModel.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      status: FriendshipStatus.PENDING,
    }).then((friendship) =>
      friendship.populate([
        { path: 'senderId', select: 'username email avatarUrl' },
        { path: 'receiverId', select: 'username email avatarUrl' },
      ]),
    );
  },

  async respondFriendRequest(id: string, data: UpdateFriendshipRequest): Promise<IFriendshipDocument> {
    const friendship = await FriendshipModel.findById(id);

    if (!friendship) {
      throw new ApiError(404, 'Friendship not found');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new ApiError(400, 'Friend request was already responded');
    }

    if (data.status === FriendshipStatus.ACCEPTED) {
      await Promise.all([
        User.updateOne({ _id: friendship.senderId }, { $addToSet: { friends: friendship.receiverId } }),
        User.updateOne({ _id: friendship.receiverId }, { $addToSet: { friends: friendship.senderId } }),
      ]);
    }

    friendship.status = data.status;
    await friendship.save();

    return friendship.populate([
      { path: 'senderId', select: 'username email avatarUrl' },
      { path: 'receiverId', select: 'username email avatarUrl' },
    ]);
  },

  async deleteFriendship(id: string): Promise<IFriendshipDocument> {
    const friendship = await FriendshipModel.findById(id);

    if (!friendship) {
      throw new ApiError(404, 'Friendship not found');
    }

    if (friendship.status === FriendshipStatus.ACCEPTED) {
      await Promise.all([
        User.updateOne({ _id: friendship.senderId }, { $pull: { friends: friendship.receiverId } }),
        User.updateOne({ _id: friendship.receiverId }, { $pull: { friends: friendship.senderId } }),
      ]);
    }

    await FriendshipModel.findByIdAndDelete(id);

    await friendship.populate([
      { path: 'senderId', select: 'username email avatarUrl' },
      { path: 'receiverId', select: 'username email avatarUrl' },
    ]);

    return friendship;
  },
};

export default friendshipService;
