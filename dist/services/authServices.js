"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordResetToken = exports.logoutService = exports.loginUserService = exports.registerUserService = void 0;
const date_fns_1 = require("date-fns");
const database_1 = __importDefault(require("../config/database"));
const jwt_1 = require("../utils/jwt");
const passwordHash_1 = require("../utils/passwordHash");
const crypto_1 = __importDefault(require("crypto"));
const registerUserService = async (name, email, password) => {
    const existingUser = await database_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await (0, passwordHash_1.hashPassword)(password);
    const newUser = await database_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "CUSTOMER",
        },
        select: { id: true, name: true, email: true, role: true },
    });
    console.log(newUser);
    const accessToken = (0, jwt_1.generateAccessToken)(newUser.id);
    const refreshToken = await (0, jwt_1.generateRefreshToken)(newUser.id);
    return { newUser, accessToken, refreshToken };
};
exports.registerUserService = registerUserService;
const loginUserService = async (email, password) => {
    const user = await database_1.default.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error("User not found!");
        error.status = 404;
        throw error;
    }
    const isPasswordValid = await (0, passwordHash_1.verifyPassword)(user.password, password);
    if (!isPasswordValid) {
        const error = new Error("Invalid credentials");
        error.status = 404;
        throw error;
    }
    console.log("user", user);
    const accessToken = (0, jwt_1.generateAccessToken)(user.id);
    const refreshToken = await (0, jwt_1.generateRefreshToken)(user.id);
    return { user, accessToken, refreshToken };
};
exports.loginUserService = loginUserService;
const logoutService = async (userId, refreshToken) => {
    if (refreshToken) {
        await database_1.default.session.deleteMany({ where: { userId, token: refreshToken } });
    }
    else {
        await database_1.default.session.deleteMany({ where: { userId } });
    }
    return { message: "Logged out successfully." };
};
exports.logoutService = logoutService;
const generatePasswordResetToken = async (userId) => {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    await database_1.default.passwordResetToken.upsert({
        where: { userId },
        update: { token: resetToken, expiresAt: (0, date_fns_1.addMinutes)(new Date(), 30) },
        create: {
            userId,
            token: resetToken,
            expiresAt: (0, date_fns_1.addMinutes)(new Date(), 30),
        },
    });
    return resetToken;
};
exports.generatePasswordResetToken = generatePasswordResetToken;
