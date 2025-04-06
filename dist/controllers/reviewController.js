"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getAllReviewsForProduct = exports.createReview = void 0;
const database_1 = __importDefault(require("../config/database"));
const createReview = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { rating, comment, productId } = req.body;
        if (rating < 1 || rating > 5) {
            res.status(400).json({ error: "Rating must be between 1 and 5" });
        }
        // ✅ Check if the user exists
        const userExists = await database_1.default.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            res.status(404).json({ error: "User not found" });
        }
        // ✅ Create a review
        const review = await database_1.default.review.create({
            data: {
                rating,
                comment,
                productId,
                userId,
            },
            include: { user: true },
        });
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ error: "Server error while creating review" });
    }
};
exports.createReview = createReview;
const getAllReviewsForProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await database_1.default.review.findMany({
            where: { id: productId },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: "Server error while fetching all reviews" });
    }
};
exports.getAllReviewsForProduct = getAllReviewsForProduct;
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.review.delete({ where: { id } });
        res.status(200).json({ message: "Review deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to delete review", error });
    }
};
exports.deleteReview = deleteReview;
