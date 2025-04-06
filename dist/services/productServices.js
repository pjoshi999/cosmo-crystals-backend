"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductService = exports.updateProductService = exports.getProductByIdService = exports.getProductsService = exports.createProductService = void 0;
const database_1 = __importDefault(require("../config/database"));
const productValidator_1 = require("../validators/productValidator");
const createProductService = async (data) => {
    const validatedData = productValidator_1.productSchema.safeParse(data);
    if (!validatedData.success) {
        console.log(validatedData.error);
        const errors = validatedData.error.format();
        throw new Error(JSON.stringify(errors));
    }
    const category = await database_1.default.category.findUnique({
        where: { id: validatedData.data.categoryId },
    });
    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }
    const subCategory = await database_1.default.subCategory.findUnique({
        where: { id: validatedData.data.subCategoryId },
    });
    if (!subCategory) {
        const error = new Error("Subcategory not found");
        error.status = 404;
        throw error;
    }
    if (subCategory?.categoryId !== validatedData.data.categoryId) {
        throw new Error("Subcategory does not belong to the given category");
    }
    const product = await database_1.default.product.create({
        data: {
            name: validatedData.data.name,
            description: validatedData.data.description ?? "",
            price: validatedData.data.price,
            salePrice: validatedData.data.salePrice,
            stock: validatedData.data.stock,
            categoryId: validatedData.data.categoryId,
            subCategoryId: validatedData.data.subCategoryId,
            images: {
                create: validatedData.data.images.map((image) => ({
                    url: image.url,
                    alt: image.alt ?? "",
                })),
            },
            attributes: {
                create: validatedData.data.attributes.map((attr) => ({
                    name: attr.name,
                    value: attr.value,
                })),
            },
        },
        include: {
            images: true,
            attributes: true,
            category: true,
            subCategory: true,
        },
    });
    return product;
};
exports.createProductService = createProductService;
const getProductsService = async (page, limit, category, minPrice, maxPrice, search) => {
    const skip = (page - 1) * limit;
    const filters = {};
    if (category) {
        filters.category = {
            name: {
                equals: category,
                mode: "insensitive",
            },
        };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        filters.price = {};
        if (minPrice !== undefined) {
            filters.price.gte = minPrice; // Greater than or equal to minPrice
        }
        if (maxPrice !== undefined) {
            filters.price.lte = maxPrice; // Less than or equal to maxPrice
        }
    }
    if (search) {
        filters.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
        ];
    }
    console.log(filters);
    const products = await database_1.default.product.findMany({
        where: filters,
        include: {
            images: true,
            attributes: {
                select: {
                    name: true,
                    value: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                },
            },
            subCategory: {
                select: {
                    id: true,
                    name: true,
                    category: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc", // Show latest products first
        },
        skip,
        take: limit,
    });
    const totalProducts = await database_1.default.product.count({ where: filters });
    return { products, totalProducts };
};
exports.getProductsService = getProductsService;
const getProductByIdService = async (id) => {
    const product = await database_1.default.product.findUnique({
        where: { id },
        include: {
            images: true,
            attributes: true,
            category: true,
            subCategory: true,
        },
    });
    return product;
};
exports.getProductByIdService = getProductByIdService;
const updateProductService = async (id, data) => {
    const validatedData = productValidator_1.productSchema.partial().safeParse(data);
    if (!validatedData.success) {
        const errors = validatedData.error.format();
        throw new Error(JSON.stringify(errors));
    }
    const existingProduct = await database_1.default.product.findUnique({ where: { id } });
    if (!existingProduct) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    const newCategoryId = validatedData.data.categoryId ?? existingProduct.categoryId;
    const newSubCategoryId = validatedData.data.subCategoryId ?? existingProduct.subCategoryId;
    // Validate new category exists
    const category = await database_1.default.category.findUnique({
        where: { id: newCategoryId },
    });
    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }
    // Validate subcategory if present
    if (newSubCategoryId) {
        const subCategory = await database_1.default.subCategory.findUnique({
            where: { id: newSubCategoryId },
        });
        if (!subCategory) {
            const error = new Error("Subcategory not found");
            error.status = 404;
            throw error;
        }
        // Validate subCategory.categoryId matches expected categoryId
        const expectedCategoryId = validatedData.data.categoryId ?? existingProduct.categoryId;
        if (subCategory.categoryId !== expectedCategoryId) {
            const error = new Error("Subcategory does not belong to the given category");
            error.status = 400;
            throw error;
        }
    }
    return await database_1.default.product.update({
        where: { id },
        data: {
            ...validatedData.data,
            categoryId: newCategoryId,
            subCategoryId: newSubCategoryId,
            images: validatedData.data.images
                ? {
                    deleteMany: {},
                    create: validatedData.data.images.map((image) => ({
                        url: image.url,
                        alt: image.alt ?? "",
                    })),
                }
                : undefined,
            attributes: validatedData.data.attributes
                ? {
                    deleteMany: {},
                    create: validatedData.data.attributes.map((attr) => ({
                        name: attr.name,
                        value: attr.value,
                    })),
                }
                : undefined,
        },
        include: {
            images: true,
            attributes: true,
            category: true,
            subCategory: true,
        },
    });
};
exports.updateProductService = updateProductService;
const deleteProductService = async (id) => {
    const product = await database_1.default.product.findUnique({ where: { id } });
    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    await database_1.default.product.delete({ where: { id } });
    return { message: "Product deleted successfully" };
};
exports.deleteProductService = deleteProductService;
