"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryService = exports.updateCategoryService = exports.getCategoryByIdService = exports.getCategoryService = exports.createCategoryService = void 0;
const database_1 = __importDefault(require("../config/database"));
const categoryValidator_1 = require("../validators/categoryValidator");
const createCategoryService = async (data) => {
    const validatedData = categoryValidator_1.categorySchema.safeParse(data);
    if (!validatedData.success) {
        const errors = validatedData.error.format();
        throw new Error(JSON.stringify(errors));
    }
    const slug = validatedData.data.slug ||
        validatedData.data.name.toLowerCase().replace(/\s+/g, "-");
    const category = await database_1.default.category.create({
        data: {
            name: validatedData.data.name,
            description: validatedData.data.description,
            slug: slug ?? "",
            image: validatedData.data.image ?? "",
        },
    });
    return category;
};
exports.createCategoryService = createCategoryService;
const getCategoryService = async (page = 1, limit = 10, search = "") => {
    const skip = (page - 1) * limit;
    const categories = await database_1.default.category.findMany({
        where: search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }
            : undefined,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { subCategory: true },
    });
    const totalCategories = await database_1.default.category.count();
    return {
        categories,
        totalPage: Math.ceil(totalCategories / limit),
        currentPage: page,
    };
};
exports.getCategoryService = getCategoryService;
const getCategoryByIdService = async (id) => {
    const category = await database_1.default.category.findUnique({ where: { id } });
    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }
    return category;
};
exports.getCategoryByIdService = getCategoryByIdService;
const updateCategoryService = async (id, data) => {
    const validatedData = categoryValidator_1.categorySchema.partial().safeParse(data);
    if (!validatedData.success) {
        const errors = validatedData.error.format();
        throw new Error(JSON.stringify(errors));
    }
    const updatedCategory = await database_1.default.category.update({
        where: { id },
        data: validatedData.data,
    });
    return updatedCategory;
};
exports.updateCategoryService = updateCategoryService;
const deleteCategoryService = async (id) => {
    const category = await database_1.default.category.findUnique({ where: { id } });
    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }
    await database_1.default.category.delete({ where: { id } });
    return { message: "Category deleted successfully" };
};
exports.deleteCategoryService = deleteCategoryService;
