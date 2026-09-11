import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken, JwtPayload } from '../utils/jwt.js';
import messageP2PService from '../services/messageP2P.service.js';
import messageGroupService from '../services/messageGroup.service.js';
import voiceChannelService from '../services/voiceChannel.service.js';
import { createVoiceToken, getLiveKitUrl } from './livekit.js';

interface P2PMessagePayload {
  receiverId?: string;
  message?: string;
  imageMessage?: string;
}

interface GroupMessagePayload {
  channelId?: string;
  message?: string;
  imageMessage?: string;
}

interface VoiceChannelPayload {
  channelId?: string;
}

interface VoiceMember {
  userId: string;
  username: string;
}

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

let ioInstance: SocketIOServer | null = null;

const voicePresence = new Map<string, Map<string, VoiceMember>>();

export const getIO = (): SocketIOServer | null => ioInstance;

const presenceSnapshot = (): Record<string, VoiceMember[]> => {
  const snapshot: Record<string, VoiceMember[]> = {};
  voicePresence.forEach((members, channelId) => {
    if (members.size > 0) {
      snapshot[channelId] = Array.from(members.values());
    }
  });
  return snapshot;
};

const removeSocketFromVoice = (socketId: string): void => {
  voicePresence.forEach((members, channelId) => {
    if (members.delete(socketId) && members.size === 0) {
      voicePresence.delete(channelId);
    }
  });
};

export const initSocket = (server: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: CORS_ORIGIN,
      credentials: true,
    },
  });

  ioInstance = io;

  const broadcastPresence = (): void => {
    io.emit('voice:presence', presenceSnapshot());
  };

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      next(new Error('Authentication token is required'));
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as JwtPayload;
    const userRoom = `user:${user.userId}`;

    socket.join(userRoom);
    socket.emit('voice:presence', presenceSnapshot());
    console.log(`🔌 ${user.username} connected (${socket.id})`);

    socket.on('p2p:message', async (payload: P2PMessagePayload, ack?: (res: unknown) => void) => {
      try {
        if (!payload?.receiverId) {
          ack?.({ ok: false, error: 'receiverId is required' });
          return;
        }

        const saved = await messageP2PService.createMessage({
          senderId: user.userId,
          receiverId: payload.receiverId,
          message: payload.message || '',
          imageMessage: payload.imageMessage || '',
        });

        const populated = await messageP2PService.getMessageById(saved._id.toString());

        io.to(userRoom).to(`user:${payload.receiverId}`).emit('p2p:message', populated);

        ack?.({ ok: true, message: populated });
      } catch (error) {
        ack?.({ ok: false, error: (error as Error).message });
      }
    });

    socket.on('join:channel', (channelId: string) => {
      if (channelId) {
        socket.join(`channel:${channelId}`);
      }
    });

    socket.on('leave:channel', (channelId: string) => {
      if (channelId) {
        socket.leave(`channel:${channelId}`);
      }
    });

    socket.on('group:message', async (payload: GroupMessagePayload, ack?: (res: unknown) => void) => {
      try {
        if (!payload?.channelId) {
          ack?.({ ok: false, error: 'channelId is required' });
          return;
        }

        const saved = await messageGroupService.createMessage({
          senderId: user.userId,
          channelId: payload.channelId,
          message: payload.message || '',
          imageMessage: payload.imageMessage || '',
        });

        const populated = await messageGroupService.getMessageById(saved._id.toString());

        io.to(`channel:${payload.channelId}`).emit('group:message', populated);

        ack?.({ ok: true, message: populated });
      } catch (error) {
        ack?.({ ok: false, error: (error as Error).message });
      }
    });

    socket.on('voice:token', async (payload: VoiceChannelPayload, ack?: (res: unknown) => void) => {
      try {
        if (!payload?.channelId) {
          ack?.({ ok: false, error: 'channelId is required' });
          return;
        }

        await voiceChannelService.getVoiceChannelById(payload.channelId);

        const token = await createVoiceToken({
          identity: user.userId,
          name: user.username,
          room: `voice:${payload.channelId}`,
        });

        ack?.({ ok: true, token, url: getLiveKitUrl() });
      } catch (error) {
        ack?.({ ok: false, error: (error as Error).message });
      }
    });

    socket.on('voice:join', (payload: VoiceChannelPayload, ack?: (res: unknown) => void) => {
      if (!payload?.channelId) {
        ack?.({ ok: false, error: 'channelId is required' });
        return;
      }

      const { channelId } = payload;
      let members = voicePresence.get(channelId);
      if (!members) {
        members = new Map<string, VoiceMember>();
        voicePresence.set(channelId, members);
      }

      members.set(socket.id, { userId: user.userId, username: user.username });
      socket.join(`voice:${channelId}`);
      broadcastPresence();

      ack?.({ ok: true });
    });

    socket.on('voice:leave', (payload: VoiceChannelPayload, ack?: (res: unknown) => void) => {
      if (!payload?.channelId) {
        ack?.({ ok: false, error: 'channelId is required' });
        return;
      }

      const { channelId } = payload;
      const members = voicePresence.get(channelId);
      if (members) {
        members.delete(socket.id);
        if (members.size === 0) {
          voicePresence.delete(channelId);
        }
      }

      socket.leave(`voice:${channelId}`);
      broadcastPresence();

      ack?.({ ok: true });
    });

    socket.on('disconnect', () => {
      removeSocketFromVoice(socket.id);
      broadcastPresence();
      console.log(`🔌 ${user.username} disconnected (${socket.id})`);
    });
  });

  return io;
};
