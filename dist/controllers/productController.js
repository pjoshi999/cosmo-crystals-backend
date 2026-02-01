"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const productServices_1 = require("../services/productServices");
// Create a product
const createProduct = async (req, res) => {
    try {
        const product = await (0, productServices_1.createProductService)(req.body);
        // Fix type checking: Ensure stock and price are numbers
        res.status(201).json({ message: "Product created successfully", product });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            try {
                const parsedError = JSON.parse(error.message);
                res
                    .status(400)
                    .json({ message: "Product validation failed", error: parsedError });
                return;
            }
            catch {
                res
                    .status(500)
                    .json({ message: "Error creating product", error: error.message });
                return;
            }
        }
        res.status(500).json({ message: "Unexpected error", error: error });
    }
};
exports.createProduct = createProduct;
// Get all products
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const minPrice = req.query.minPrice
            ? parseFloat(req.query.minPrice)
            : undefined;
        const maxPrice = req.query.maxPrice
            ? parseFloat(req.query.maxPrice)
            : undefined;
        const search = req.query.search;
        const { products, totalProducts } = await (0, productServices_1.getProductsService)(page, limit, category, minPrice, maxPrice, search);
        res.status(200).json({
            message: "Products fetched successfully",
            products,
            pagination: {
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                limit,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching all products", error });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Product ID is required" });
            return;
        }
        const product = await (0, productServices_1.getProductByIdService)(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
        return;
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching product", error });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await (0, productServices_1.updateProductService)(req.params.id, req.body);
        res
            .status(200)
            .json({ message: "Product updated successfully", updatedProduct });
        return;
    }
    catch (error) {
        res.status(error.status || 400).json({
            message: error.message || "Error updating product",
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await (0, productServices_1.deleteProductService)(req.params.id);
        res.status(200).json(product);
        return;
    }
    catch (error) {
        res.status(error.status || 400).json({
            message: error.message || "Error deleting product",
        });
    }
};
exports.deleteProduct = deleteProduct;
