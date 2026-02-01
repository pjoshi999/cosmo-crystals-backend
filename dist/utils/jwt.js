"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../config/database"));
const date_fns_1 = require("date-fns");
dotenv_1.default.config();
const ACCESS_SECRET = process.env.ACCESS_SECRET || "maverick";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "maverick-refresh";
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (userId) => {
    const refreshToken = jsonwebtoken_1.default.sign({ userId }, REFRESH_SECRET, {
        expiresIn: "15d",
    });
    await database_1.default.session.create({
        data: {
            userId,
            token: refreshToken,
            expiresAt: (0, date_fns_1.addDays)(new Date(), 15),
        },
    });
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (accessToken) => {
    return jsonwebtoken_1.default.verify(accessToken, ACCESS_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = async (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
        if (typeof decoded === "string") {
            throw new Error("Invalid token payload");
        }
        const storedSession = await database_1.default.session.findFirst({
            where: {
                userId: decoded.userId,
                token: refreshToken,
            },
        });
        if (!storedSession) {
            throw new Error("Invalid or expired refresh token");
        }
        return decoded;
    }
    catch (error) {
        throw new Error(`Invalid refresh token: ${error.message}`);
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
