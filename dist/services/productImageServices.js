"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductImageService = exports.updateProductImageService = exports.createProductImageService = void 0;
const database_1 = __importDefault(require("../config/database"));
const productValidator_1 = require("../validators/productValidator");
const createProductImageService = async (data) => {
    const validatedData = productValidator_1.productImageSchema.safeParse(data);
    if (!validatedData.success) {
        console.log(validatedData.error);
        const errors = validatedData.error.format();
        throw new Error(JSON.stringify(errors));
    }
    // if the image is set as main, update all other images to false
    if (validatedData.data.isMain) {
        await database_1.default.productImage.updateMany({
            where: {
                productId: validatedData.data.productId,
                isMain: true,
            },
            data: { isMain: false },
        });
    }
    // create product image
    const productImage = await database_1.default.productImage.create({
        data: validatedData.data,
    });
    return productImage;
};
exports.createProductImageService = createProductImageService;
const updateProductImageService = async (id, data) => {
    const validatedData = productValidator_1.productImageSchema.partial().safeParse(data);
    if (!validatedData.success) {
        const errors = validatedData.error.format();
        throw new Error(JSON.stringify(errors));
    }
    const productImage = await database_1.default.productImage.findUnique({ where: { id } });
    if (!productImage) {
        const error = new Error("Product image not found");
        error.status = 404;
        throw error;
    }
    // if the image is set as main, update all other images to false
    if (validatedData.data?.isMain) {
        await database_1.default.productImage.updateMany({
            where: {
                productId: validatedData.data.productId,
                isMain: true,
            },
            data: { isMain: false },
        });
    }
    return await database_1.default.productImage.update({
        where: { id },
        data: validatedData.data,
    });
};
exports.updateProductImageService = updateProductImageService;
const deleteProductImageService = async (id) => {
    const productImage = await database_1.default.productImage.findUnique({ where: { id } });
    if (!productImage) {
        const error = new Error("Product image not found");
        error.status = 404;
        throw error;
    }
    await database_1.default.productImage.delete({ where: { id } });
    return { message: "Product Image deleted successfully" };
};
exports.deleteProductImageService = deleteProductImageService;
