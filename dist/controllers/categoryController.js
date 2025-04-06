"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const categoryServices_1 = require("../services/categoryServices");
const createCategory = async (req, res) => {
    try {
        const category = await (0, categoryServices_1.createCategoryService)(req.body);
        res
            .status(201)
            .json({ message: "Category created successfully", category });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            try {
                const parsedError = JSON.parse(error.message);
                res
                    .status(400)
                    .json({ message: "Category validation failed", error: parsedError });
                return;
            }
            catch {
                res
                    .status(500)
                    .json({ message: "Error creating category", error: error.message });
                return;
            }
        }
        res.status(500).json({ message: "Unexpected error", error: error });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const result = await (0, categoryServices_1.getCategoryService)(page, limit, search);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching categories", error });
    }
};
exports.getCategories = getCategories;
const updateCategory = async (req, res) => {
    try {
        const category = await (0, categoryServices_1.updateCategoryService)(req.params.id, req.body);
        res
            .status(200)
            .json({ message: "Category updated successfully", category });
        return;
    }
    catch (error) {
        res
            .status(400)
            .json({ message: "Error updating category", error: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const category = await (0, categoryServices_1.deleteCategoryService)(req.params.id);
        res.status(200).json(category);
        return;
    }
    catch (error) {
        res
            .status(400)
            .json({ message: "Error deleting category", error: error.message });
    }
};
exports.deleteCategory = deleteCategory;
