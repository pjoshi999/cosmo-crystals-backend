"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileService = void 0;
const database_1 = __importDefault(require("../config/database"));
const getProfileService = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const user = await database_1.default.user.findUnique({
        where: { id: userId },
        include: {
            wishList: {
                include: {
                    product: true,
                },
            },
            addresses: true,
            orders: {
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });
    return user;
};
exports.getProfileService = getProfileService;
