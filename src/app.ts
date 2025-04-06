import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import reviewRoutes from "./routes/reviewRoutes";
import productRoutes from "./routes/productRoutes";
import productImageRoutes from "./routes/productImageRoutes";
import cartRoutes from "./routes/cartRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import subCategoryRoutes from "./routes/subCategoryRoutes";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createHash } from "node:crypto";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: "Too many requests, please try again later.",
  })
); // 15 mins

app.use("/assets", express.static("assets"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/products/images", productImageRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/subcategory", subCategoryRoutes);
app.use("/api/v1/profile", profileRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "✅ Server is running" });
});

// app.use(errorMiddleware);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

export default app;
