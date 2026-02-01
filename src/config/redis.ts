import { Redis } from "ioredis";

const getRedisConnectionOptions = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  if (process.env.REDIS_HOST) {
    return {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      password: process.env.REDIS_PASSWORD,
    };
  }

  return "redis://localhost:6379";
};

const connectionOptions = getRedisConnectionOptions();

const connection = new Redis(connectionOptions as any, {
  maxRetriesPerRequest: null,
});

connection.on("error", (err) => {
  console.error("Redis error:", err);
});

connection.on("connect", () => {
  console.log("Connected to Redis");
});

export default connection;
