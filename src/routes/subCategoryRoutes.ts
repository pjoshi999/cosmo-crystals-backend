import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
} from "../controllers/subCategoryController";

const router = express.Router();

router.get("/", getSubCategories);
router.post("/create-subcategory", createSubCategory);
router.patch("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
