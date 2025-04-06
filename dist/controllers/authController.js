"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPassword = exports.forgotPassword = exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const authServices_1 = require("../services/authServices");
const authValidator_1 = require("../validators/authValidator");
const jwt_1 = require("../utils/jwt");
const database_1 = __importDefault(require("../config/database"));
const emailService_1 = require("../utils/emailService");
const passwordHash_1 = require("../utils/passwordHash");
// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const parsedData = authValidator_1.signUpSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ errors: parsedData.error.errors });
            return;
        }
        const { name, email, password } = parsedData.data;
        const { newUser, accessToken, refreshToken } = await (0, authServices_1.registerUserService)(name, email, password);
        res.status(200).json({
            message: "User registered successfully",
            user: newUser,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.registerUser = registerUser;
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        if (!req.body.email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }
        if (!req.body.password) {
            res.status(400).json({ error: "Password is required" });
            return;
        }
        const parsedData = authValidator_1.loginSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ errors: parsedData.error.errors });
            return;
        }
        const { email, password } = parsedData.data;
        const { accessToken, refreshToken } = await (0, authServices_1.loginUserService)(email, password);
        res.status(200).json({
            message: "Login successfully",
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.loginUser = loginUser;
// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({ error: "Refresh token is required" });
            return;
        }
        const decoded = await (0, jwt_1.verifyRefreshToken)(refreshToken);
        console.log("check", decoded);
        if (!decoded || typeof decoded !== "object" || !decoded.userId) {
            res.status(401).json({ error: "Invalid refresh token" });
            return;
        }
        const user = await database_1.default.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(user.id);
        const newRefreshToken = await (0, jwt_1.generateRefreshToken)(user.id);
        // Invalidate the old refresh token
        await database_1.default.session.deleteMany({
            where: { userId: user.id, token: refreshToken },
        });
        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        res.status(403).json({ error: error.message });
    }
};
exports.refreshAccessToken = refreshAccessToken;
// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const resetToken = await (0, authServices_1.generatePasswordResetToken)(user.id);
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        await (0, emailService_1.sendResetEmail)(user.email, resetLink);
        res.status(200).json({ message: "Password reset link sent" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.forgotPassword = forgotPassword;
// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken) {
            res.status(400).json({ error: "Reset Token is required" });
            return;
        }
        if (!newPassword) {
            res.status(400).json({ error: "Password is required" });
            return;
        }
        const resetRecord = await database_1.default.passwordResetToken.findUnique({
            where: { token: resetToken },
        });
        if (!resetToken || !resetRecord || resetRecord.expiresAt < new Date()) {
            res.status(400).json({ error: "Invalid or expired token" });
            return;
        }
        const hashedPassword = await (0, passwordHash_1.hashPassword)(newPassword);
        await database_1.default.user.update({
            where: { id: resetRecord.userId },
            data: {
                password: hashedPassword,
            },
        });
        await database_1.default.passwordResetToken.delete({ where: { token: resetToken } });
        res.status(200).json({ message: "Password reset successful" });
        await database_1.default.session.deleteMany({
            where: { userId: resetRecord.userId },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.resetPassword = resetPassword;
// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Public
const logout = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        await (0, authServices_1.logoutService)(userId, req.body?.refreshToken);
        res.status(200).json({ message: "Logged out successfully." });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.logout = logout;
