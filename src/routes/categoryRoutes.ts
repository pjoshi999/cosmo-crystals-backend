import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController";

const router = express.Router();

router.post("/create-category", createCategory);
router.get("/categories", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
