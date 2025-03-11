import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviewsForProduct,
} from "../controllers/reviewController";
import validateRequest from "../middlewares/validateRequest";
import { reviewSchema } from "../validators/reviewValidator";

const router = express.Router();

router.post("/", validateRequest(reviewSchema), createReview);
router.get("/:productId", getAllReviewsForProduct);
router.delete("/:id", deleteReview);

export default router;
