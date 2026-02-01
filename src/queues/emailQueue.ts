import { Queue } from "bullmq";
import connection from "../config/redis";

export const emailQueue = new Queue("email-queue", {
  connection,
});

export const addEmailJob = async (name: string, data: any) => {
  return emailQueue.add(name, data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: { count: 50 },
  });
};
