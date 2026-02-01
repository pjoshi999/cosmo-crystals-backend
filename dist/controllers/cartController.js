"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.updateCart = exports.getCartItems = exports.addToCart = void 0;
const cartServices_1 = require("../services/cartServices");
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cartItem = await (0, cartServices_1.addToCartService)(req.user?.id, productId, quantity);
        res.status(201).json(cartItem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addToCart = addToCart;
const getCartItems = async (req, res) => {
    try {
        const cartItems = await (0, cartServices_1.getCartItemsService)(req.user?.id);
        res.status(200).json(cartItems);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCartItems = getCartItems;
const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cartItem = await (0, cartServices_1.updateCartService)(req.user?.id, productId, quantity);
        res.status(200).json(cartItem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCart = updateCart;
const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }
        const cartItem = await (0, cartServices_1.removeFromCartService)(req.user?.id, id);
        res.status(200).json(cartItem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removeFromCart = removeFromCart;
