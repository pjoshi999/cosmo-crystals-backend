"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const productImageRoutes_1 = __importDefault(require("./routes/productImageRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const subCategoryRoutes_1 = __importDefault(require("./routes/subCategoryRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "*", credentials: true }));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: "Too many requests, please try again later.",
})); // 15 mins
app.use("/assets", express_1.default.static("assets"));
// Routes
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/products", productRoutes_1.default);
app.use("/api/v1/products/images", productImageRoutes_1.default);
app.use("/api/v1/category", categoryRoutes_1.default);
app.use("/api/v1/reviews", reviewRoutes_1.default);
app.use("/api/v1/cart", cartRoutes_1.default);
app.use("/api/v1/subcategory", subCategoryRoutes_1.default);
app.use("/api/v1/profile", profileRoutes_1.default);
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
exports.default = app;
