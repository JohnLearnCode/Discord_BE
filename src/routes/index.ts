import { Router } from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import serverRoutes from './server.routes.js';
import catalogRoutes from './catalog.routes.js';
import textChannelRoutes from './textChannel.routes.js';
import voiceChannelRoutes from './voiceChannel.routes.js';
import messageP2PRoutes from './messageP2P.routes.js';
import messageGroupRoutes from './messageGroup.routes.js';
import friendshipRoutes from './friendship.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/servers', serverRoutes);
router.use('/catalogs', catalogRoutes);
router.use('/text-channels', textChannelRoutes);
router.use('/voice-channels', voiceChannelRoutes);
router.use('/messages-p2p', messageP2PRoutes);
router.use('/messages-group', messageGroupRoutes);
router.use('/friendships', friendshipRoutes);

export default router;
