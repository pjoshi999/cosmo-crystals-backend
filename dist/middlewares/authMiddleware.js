"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = __importDefault(require("../config/database"));
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ error: "Unauthorized. Token missing." });
            return;
        }
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        console.log("decoded user", decoded);
        if (typeof decoded === "string" || !decoded.id) {
            res.status(401).json({ error: "Unauthorized. Invalid token." });
            return;
        }
        const user = await database_1.default.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, role: true },
        });
        if (!user) {
            res.status(401).json({ error: "Unauthorized. User not found." });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};
exports.authMiddleware = authMiddleware;
const adminOnly = (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
        res.status(403).json({ error: "Access denied. Admins only." });
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
