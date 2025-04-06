import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getCategories);
router.post("/create-category", authMiddleware, adminOnly, createCategory);
router.patch("/:id", authMiddleware, adminOnly, updateCategory);
router.delete("/:id", authMiddleware, adminOnly, deleteCategory);

export default router;
