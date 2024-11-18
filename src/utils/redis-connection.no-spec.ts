import { RedisMemoryServer } from 'redis-memory-server';

const redisServer = new RedisMemoryServer();

let host: string;
let port: number;

const defaultOptions = {
  wildcards: true,
  retryAttempts: 5,
  retryDelay: 3000,
};

export const getRedisConfig = async () => {
  if (host && port) {
    return { ...defaultOptions, host, port };
  }

  host = await redisServer.getHost();
  port = await redisServer.getPort();

  return { ...defaultOptions, host, port };
};
