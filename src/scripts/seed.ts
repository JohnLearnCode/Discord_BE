import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import Server from '../models/server.model.js';
import Catalog from '../models/catalog.model.js';
import TextChannel from '../models/textChannel.model.js';
import VoiceChannel from '../models/voiceChannel.model.js';
import MessageP2P from '../models/messageP2P.model.js';
import MessageGroup from '../models/messageGroup.model.js';
import Friendship from '../models/friendship.model.js';
import { FriendshipStatus, UserRole } from '../types/index.js';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'Discord_remake';
const SALT_ROUNDS = 10;

const seed = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URL, { dbName: DB_NAME });
  console.log('MongoDB connected successfully');

  const models = [User, Server, Catalog, TextChannel, VoiceChannel, MessageP2P, MessageGroup, Friendship];
  for (const model of models) {
    await (model as unknown as { deleteMany: (filter?: Record<string, unknown>) => Promise<unknown> }).deleteMany({});
  }
  console.log('Cleared all existing data');

  const passwordHash = await bcrypt.hash('password123', SALT_ROUNDS);

  const [alice, bob, charlie, david] = await User.create([
    {
      username: 'alice',
      email: 'alice@example.com',
      passwordHash,
      bio: 'Hello, I am Alice',
      role: UserRole.OWNER,
    },
    {
      username: 'bob',
      email: 'bob@example.com',
      passwordHash,
      bio: 'Hello, I am Bob',
      role: UserRole.ADMIN,
    },
    {
      username: 'charlie',
      email: 'charlie@example.com',
      passwordHash,
      bio: 'Hello, I am Charlie',
      role: UserRole.USER,
    },
    {
      username: 'david',
      email: 'david@example.com',
      passwordHash,
      bio: 'Hello, I am David',
      role: UserRole.USER,
    },
  ]);
  console.log(`Seeded ${[alice, bob, charlie, david].length} users`);

  const [generalText, randomText, musicVoice, gamingVoice] = await Promise.all([
    TextChannel.create({ title: 'general' }),
    TextChannel.create({ title: 'random' }),
    VoiceChannel.create({ title: 'Music Room' }),
    VoiceChannel.create({ title: 'Gaming Room' }),
  ]);

  const [mainCatalog, funCatalog] = await Catalog.create([
    { title: 'Main Channels', channelIds: [generalText._id] },
    { title: 'Fun Channels', channelIds: [randomText._id] },
  ]);

  const [mainServer, funServer] = await Server.create([
    {
      name: 'Main Server',
      ownerId: alice._id,
      memberIds: [alice._id, bob._id, charlie._id, david._id],
      channelIds: [generalText._id, musicVoice._id],
      catalogIds: [mainCatalog._id],
    },
    {
      name: 'Fun Server',
      ownerId: bob._id,
      memberIds: [bob._id, alice._id, charlie._id],
      channelIds: [randomText._id, gamingVoice._id],
      catalogIds: [funCatalog._id],
    },
  ]);
  console.log('Seeded servers, catalogs, text/voice channels');

  await User.updateMany(
    { _id: { $in: [alice._id, bob._id, charlie._id, david._id] } },
    { serverIds: [mainServer._id, funServer._id] },
  );

  await MessageP2P.create([
    { senderId: alice._id, receiverId: bob._id, message: 'Hey Bob!' },
    { senderId: bob._id, receiverId: alice._id, message: 'Hi Alice, how are you?' },
    { senderId: alice._id, receiverId: bob._id, message: 'I am good, thanks!' },
  ]);

  await MessageGroup.create([
    { senderId: alice._id, channelId: generalText._id, message: 'Welcome everyone!' },
    { senderId: bob._id, channelId: generalText._id, message: 'Happy to be here.' },
    { senderId: charlie._id, channelId: randomText._id, message: 'Random chat here!' },
  ]);
  console.log('Seeded P2P and group messages');

  await Friendship.create([
    { senderId: alice._id, receiverId: bob._id, status: FriendshipStatus.ACCEPTED },
    { senderId: charlie._id, receiverId: alice._id, status: FriendshipStatus.PENDING },
    { senderId: david._id, receiverId: bob._id, status: FriendshipStatus.REJECTED },
  ]);

  await User.updateOne({ _id: alice._id }, { $addToSet: { friends: bob._id } });
  await User.updateOne({ _id: bob._id }, { $addToSet: { friends: alice._id } });
  console.log('Seeded friendships and synced accepted friends');

  await mongoose.connection.close();
  console.log('Seed completed successfully');
};

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
