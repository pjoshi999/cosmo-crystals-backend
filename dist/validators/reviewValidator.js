"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = require("zod");
exports.reviewSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid({ message: "Invalid user ID" }),
    productId: zod_1.z.string().uuid({ message: "Invalid product ID" }),
    rating: zod_1.z.number().int().min(1).max(5).optional(),
    comment: zod_1.z.string().optional(),
});
