"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productImageSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters long"),
    description: zod_1.z.string().min(5, "Description must be at least 5 characters"),
    price: zod_1.z.number().positive("Price must be a positive number"),
    salePrice: zod_1.z.number().positive("Sale Price must be a positive number"),
    stock: zod_1.z.number().int().nonnegative("Stock must be a non-negative integer"),
    // weight: z.number().positive().optional(),
    // length: z.number().positive().optional(),
    // width: z.number().positive().optional(),
    // height: z.number().positive().optional(),
    categoryId: zod_1.z.string().uuid("Invalid category ID format"),
    subCategoryId: zod_1.z.string().uuid("Invalid subcategory ID format").optional(),
    images: zod_1.z
        .array(zod_1.z.object({
        url: zod_1.z.string().url("Invalid image URL format"),
        alt: zod_1.z.string().optional().default(""),
        isMain: zod_1.z.boolean().optional().default(false),
    }))
        .min(1, "At least one image is required"),
    attributes: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string().min(1, "Attribute name is required"),
        value: zod_1.z.union([
            zod_1.z.string().min(1, "Attribute value is required"),
            zod_1.z.number(),
        ]),
    }))
        .optional()
        .default([]),
});
exports.productImageSchema = zod_1.z.object({
    url: zod_1.z.string().url("Invalid image URL format"),
    productId: zod_1.z.string().uuid("Invalid image ID format"),
    alt: zod_1.z.string().optional().default(""),
    isMain: zod_1.z.boolean().optional().default(false),
});
