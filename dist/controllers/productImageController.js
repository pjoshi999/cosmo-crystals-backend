"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductImage = exports.updateProductImage = exports.createProductImage = void 0;
const productImageServices_1 = require("../services/productImageServices");
const createProductImage = async (req, res) => {
    try {
        const { productId, url } = req.body;
        if (!productId) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }
        if (!url) {
            res.status(400).json({ error: "Product Image URL is required" });
            return;
        }
        const product = await (0, productImageServices_1.createProductImageService)(req.body);
        // Fix type checking: Ensure stock and price are numbers
        res
            .status(201)
            .json({ message: "Product Image created successfully", product });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            try {
                const parsedError = JSON.parse(error.message);
                res.status(400).json({
                    message: "Product Image validation failed",
                    error: parsedError,
                });
                return;
            }
            catch {
                res.status(500).json({
                    message: "Error creating product image",
                    error: error.message,
                });
                return;
            }
        }
        res.status(500).json({ message: "Unexpected error", error: error });
    }
};
exports.createProductImage = createProductImage;
const updateProductImage = async (req, res) => {
    try {
        const updatedProduct = await (0, productImageServices_1.updateProductImageService)(req.params.id, req.body);
        res
            .status(200)
            .json({ message: "Product Image updated successfully", updatedProduct });
        return;
    }
    catch (error) {
        res.status(error.status || 400).json({
            message: error.message || "Error updating product image",
        });
    }
};
exports.updateProductImage = updateProductImage;
const deleteProductImage = async (req, res) => {
    try {
        const product = await (0, productImageServices_1.deleteProductImageService)(req.params.id);
        res.status(200).json(product);
        return;
    }
    catch (error) {
        res.status(error.status || 400).json({
            message: error.message || "Error deleting product image",
        });
    }
};
exports.deleteProductImage = deleteProductImage;
