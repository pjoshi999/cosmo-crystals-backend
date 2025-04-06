import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
} from "../controllers/subCategoryController";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getSubCategories);
router.post(
  "/create-subcategory",
  authMiddleware,
  adminOnly,
  createSubCategory
);
router.patch("/:id", authMiddleware, adminOnly, updateSubCategory);
router.delete("/:id", authMiddleware, adminOnly, deleteSubCategory);

export default router;
