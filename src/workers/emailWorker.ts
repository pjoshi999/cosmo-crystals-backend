import { Worker } from "bullmq";
import connection from "../config/redis";
import { sendOrderEmail } from "../utils/emailService";

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Processing email job ${job.id}`);
    const { email, orderDetails } = job.data;

    if (!email || !orderDetails) {
      throw new Error("Missing email or order details");
    }

    try {
      await sendOrderEmail(email, orderDetails);
      console.log(
        `Email sent to ${email} for order ${orderDetails.orderId || "unknown"}`,
      );
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  if (job) {
    console.log(`Job ${job.id} failed with error ${err.message}`);
  } else {
    console.log(`Job failed with error ${err.message}`);
  }
});
