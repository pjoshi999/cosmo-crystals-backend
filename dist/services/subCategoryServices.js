"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategoryService = exports.updateSubCategoryService = exports.getAllSubCategoryByIdService = exports.getAllSubCategoriesService = exports.createSubCategoryService = void 0;
const database_1 = __importDefault(require("../config/database"));
const subCategoryValidator_1 = require("../validators/subCategoryValidator");
const createSubCategoryService = async (data) => {
    const validatedData = subCategoryValidator_1.subCategorySchema.safeParse(data);
    if (!validatedData.success) {
        const errors = validatedData.error.format();
        throw new Error(JSON.stringify(errors));
    }
    const category = await database_1.default.category.findUnique({
        where: { id: validatedData.data.categoryId },
    });
    if (!category) {
        const error = new Error("Category not found!");
        error.status = 404;
        throw error;
    }
    const slug = validatedData.data.slug ||
        validatedData.data.name.toLowerCase().replace(/\s+/g, "-");
    const subCategory = await database_1.default.subCategory.create({
        data: {
            name: validatedData.data.name,
            slug: slug,
            categoryId: validatedData.data.categoryId,
        },
        include: { category: true },
    });
    return subCategory;
};
exports.createSubCategoryService = createSubCategoryService;
const getAllSubCategoriesService = async (categoryId) => {
    const subCategories = await database_1.default.subCategory.findMany({
        where: categoryId ? { id: categoryId } : {},
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                },
            },
        },
        orderBy: { name: "desc" },
    });
    return subCategories;
};
exports.getAllSubCategoriesService = getAllSubCategoriesService;
const getAllSubCategoryByIdService = async (subCategoryId) => {
    const subCategory = await database_1.default.subCategory.findUnique({
        where: { id: subCategoryId },
        include: { category: true },
    });
    return subCategory;
};
exports.getAllSubCategoryByIdService = getAllSubCategoryByIdService;
const updateSubCategoryService = async (subCategoryId, data) => {
    const subCategory = await database_1.default.subCategory.findUnique({
        where: { id: subCategoryId },
        include: { category: true },
    });
    if (!subCategory) {
        const error = new Error("SubCategory not found");
        error.status = 404;
        throw error;
    }
    const validatedData = subCategoryValidator_1.subCategorySchema.partial().safeParse(data);
    if (!validatedData.success) {
        const errors = validatedData.error.format();
        throw new Error(JSON.stringify(errors));
    }
    return database_1.default.subCategory.update({
        where: { id: subCategoryId },
        data: validatedData.data,
        include: { category: true },
    });
};
exports.updateSubCategoryService = updateSubCategoryService;
const deleteSubCategoryService = async (subCategoryId) => {
    const subCategory = await database_1.default.subCategory.findUnique({
        where: { id: subCategoryId },
    });
    if (!subCategory) {
        const error = new Error("SubCategory not found!");
        error.status = 404;
        throw error;
    }
    await database_1.default.subCategory.delete({
        where: { id: subCategoryId },
    });
    return { message: "SubCategory deleted successfully" };
};
exports.deleteSubCategoryService = deleteSubCategoryService;
