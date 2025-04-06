"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCartService = exports.updateCartService = exports.getCartItemsService = exports.addToCartService = void 0;
const database_1 = __importDefault(require("../config/database"));
const addToCartService = async (userId, productId, quantity) => {
    if (!userId) {
        throw new Error("Unauthorized");
    }
    if (!quantity) {
        throw new Error("Quantity is required");
    }
    if (quantity < 1) {
        throw new Error("Quantity must be greater than 0");
    }
    const user = await database_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }
    const product = await database_1.default.product.findUnique({
        where: { id: productId },
    });
    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    const cartItem = await database_1.default.cartItem.findFirst({
        where: { productId: productId, userId: userId },
    });
    if (cartItem) {
        throw new Error("Product already in cart");
    }
    const newCartItem = await database_1.default.cartItem.create({
        data: {
            quantity,
            user: {
                connect: { id: userId },
            },
            product: {
                connect: { id: productId },
            },
        },
        include: { product: true },
    });
    return newCartItem;
};
exports.addToCartService = addToCartService;
const getCartItemsService = async (userId) => {
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const cartItems = await database_1.default.cartItem.findMany({
        where: { userId },
        include: {
            product: {
                include: {
                    images: true,
                },
            },
        },
    });
    return cartItems;
};
exports.getCartItemsService = getCartItemsService;
const updateCartService = async (userId, productId, quantity) => {
    if (!userId) {
        throw new Error("Unauthorized");
    }
    if (!quantity) {
        throw new Error("Quantity is required");
    }
    if (quantity < 1) {
        throw new Error("Quantity must be greater than 0");
    }
    const user = await database_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }
    const product = await database_1.default.product.findUnique({
        where: { id: productId },
    });
    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    const cartItem = await database_1.default.cartItem.findFirst({
        where: { productId: productId, userId: userId },
    });
    if (!cartItem) {
        throw new Error("Product not found in cart");
    }
    const updatedCartItem = await database_1.default.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: {
            quantity,
        },
        include: { product: true },
    });
    return updatedCartItem;
};
exports.updateCartService = updateCartService;
const removeFromCartService = async (userId, productId) => {
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const user = await database_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }
    const product = await database_1.default.product.findUnique({
        where: { id: productId },
    });
    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    const cartItem = await database_1.default.cartItem.findFirst({
        where: { productId },
    });
    if (!cartItem) {
        throw new Error("Product is not added in cart");
    }
    await database_1.default.cartItem.delete({
        where: { userId_productId: { userId: userId, productId: productId } },
    });
    return { message: "Product removed from cart successfully" };
};
exports.removeFromCartService = removeFromCartService;
