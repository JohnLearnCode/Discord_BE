import { AccessToken } from 'livekit-server-sdk';

interface VoiceTokenOptions {
  identity: string;
  name: string;
  room: string;
}

const getApiKey = (): string => process.env.LIVEKIT_API_KEY || '';
const getApiSecret = (): string => process.env.LIVEKIT_API_SECRET || '';

export const getLiveKitUrl = (): string => process.env.LIVEKIT_URL || 'ws://localhost:7880';

export const createVoiceToken = async ({ identity, name, room }: VoiceTokenOptions): Promise<string> => {
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit credentials are not configured');
  }

  const accessToken = new AccessToken(apiKey, apiSecret, {
    identity,
    name,
    ttl: '6h',
  });

  accessToken.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return accessToken.toJwt();
};
