import express from "express";
import {
  createProductImage,
  deleteProductImage,
  updateProductImage,
} from "../controllers/productImageController";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", authMiddleware, adminOnly, createProductImage);
router.patch("/:id", authMiddleware, adminOnly, updateProductImage);
router.delete("/:id", authMiddleware, adminOnly, deleteProductImage);

export default router;
