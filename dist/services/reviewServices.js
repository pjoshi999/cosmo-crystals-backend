"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getReviewById = exports.getAllReviewsForProduct = exports.createReview = void 0;
const database_1 = __importDefault(require("../config/database"));
const createReview = async (data) => {
    return await database_1.default.review.create({ data });
};
exports.createReview = createReview;
const getAllReviewsForProduct = async (productId) => {
    return await database_1.default.review.findMany({
        where: { productId },
        include: { user: { select: { id: true, name: true } } },
    });
};
exports.getAllReviewsForProduct = getAllReviewsForProduct;
const getReviewById = async (id) => {
    return await database_1.default.review.findUnique({ where: { id } });
};
exports.getReviewById = getReviewById;
const deleteReview = async (id) => {
    return await database_1.default.review.delete({ where: { id } });
};
exports.deleteReview = deleteReview;
