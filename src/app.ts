import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
// import reviewRoutes from "./routes/reviewRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import authRoutes from "./routes/authRoutes";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;

const app = express();

dotenv.config();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  })
); // 15 mins

app.use("/assets", express.static("assets"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);
// app.use("/api/v1/reviews", reviewRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "✅ Server is running" });
});

// app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
