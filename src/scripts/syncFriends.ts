import 'dotenv/config';
import mongoose from 'mongoose';

import User from '../models/user.model.js';
import Friendship from '../models/friendship.model.js';
import { FriendshipStatus } from '../types/index.js';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'Discord_remake';

const syncFriends = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URL, { dbName: DB_NAME });
  console.log('MongoDB connected successfully');

  const accepted = await Friendship.find({ status: FriendshipStatus.ACCEPTED });

  const expected = new Map<string, Set<string>>();
  const addLink = (owner: unknown, friend: unknown) => {
    const ownerId = String(owner);
    const friendId = String(friend);
    if (!expected.has(ownerId)) {
      expected.set(ownerId, new Set());
    }
    expected.get(ownerId)?.add(friendId);
  };

  for (const friendship of accepted) {
    addLink(friendship.senderId, friendship.receiverId);
    addLink(friendship.receiverId, friendship.senderId);
  }

  const users = await User.find().select('username friends');
  let updated = 0;

  for (const user of users) {
    const expectedIds = Array.from(expected.get(String(user._id)) || []);
    const currentIds = (user.friends || []).map((id) => String(id));
    const isSame =
      expectedIds.length === currentIds.length &&
      expectedIds.every((id) => currentIds.includes(id));

    if (!isSame) {
      await User.updateOne({ _id: user._id }, { $set: { friends: expectedIds } });
      updated += 1;
      console.log(
        `  ${user.username}: [${currentIds.join(', ')}] -> [${expectedIds.join(', ')}]`,
      );
    }
  }

  console.log(
    `Reconciled ${accepted.length} accepted friendship(s), updated ${updated}/${users.length} user(s)`,
  );

  await mongoose.connection.close();
  console.log('Sync completed successfully');
};

syncFriends().catch(async (error) => {
  console.error('Sync failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
