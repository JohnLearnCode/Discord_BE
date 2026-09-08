import app from './app.js';
import connectDatabase from './config/database.js';
import { connectRedis, closeRedis, isRedisConnected } from './config/redis.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  try {
    await connectRedis();
  } catch (error) {
    console.warn('⚠️ Redis unavailable, server will start without cache');
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });

  const gracefulShutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      try {
        if (isRedisConnected()) {
          await closeRedis();
        }
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
};

startServer();
