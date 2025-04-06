"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const argon2_1 = __importDefault(require("argon2"));
const hashPassword = async (password) => {
    return await argon2_1.default.hash(password, {
        type: argon2_1.default.argon2id, // Use Argon2id for best security
        memoryCost: 65536, // Prevent GPU attacks
        timeCost: 3, // Increase computation time
        parallelism: 2, // Adjust based on system performance
    });
};
exports.hashPassword = hashPassword;
const verifyPassword = async (passwordHash, password) => {
    return await argon2_1.default.verify(passwordHash, password);
};
exports.verifyPassword = verifyPassword;
