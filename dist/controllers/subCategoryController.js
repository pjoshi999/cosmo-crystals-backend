"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.updateSubCategory = exports.getSubCategories = exports.createSubCategory = void 0;
const subCategoryServices_1 = require("../services/subCategoryServices");
const createSubCategory = async (req, res) => {
    try {
        const subcategory = await (0, subCategoryServices_1.createSubCategoryService)(req.body);
        res
            .status(201)
            .json({ message: "SubCategory created successfully", subcategory });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            try {
                const parsedError = JSON.parse(error.message);
                res.status(400).json({
                    message: "SubCategory validation failed",
                    error: parsedError,
                });
                return;
            }
            catch {
                res.status(500).json({
                    message: "Error creating subCategory",
                    error: error.message,
                });
                return;
            }
        }
        res.status(500).json({ message: "Unexpected error", error: error });
    }
};
exports.createSubCategory = createSubCategory;
const getSubCategories = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        if (!categoryId) {
            const result = await (0, subCategoryServices_1.getAllSubCategoriesService)();
            res.status(200).json(result);
            return;
        }
        const result = await (0, subCategoryServices_1.getAllSubCategoriesService)(categoryId);
        res.status(200).json(result);
        return;
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching categories", error });
    }
};
exports.getSubCategories = getSubCategories;
const updateSubCategory = async (req, res) => {
    try {
        const category = await (0, subCategoryServices_1.updateSubCategoryService)(req.params.id, req.body);
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
exports.updateSubCategory = updateSubCategory;
const deleteSubCategory = async (req, res) => {
    try {
        const category = await (0, subCategoryServices_1.deleteSubCategoryService)(req.params.id);
        res.status(200).json(category);
        return;
    }
    catch (error) {
        res
            .status(400)
            .json({ message: "Error deleting category", error: error.message });
    }
};
exports.deleteSubCategory = deleteSubCategory;
