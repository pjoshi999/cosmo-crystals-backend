"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategorySchema = void 0;
const zod_1 = require("zod");
exports.subCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long"),
    slug: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid("Invalid category ID format"),
});
