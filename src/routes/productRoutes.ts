import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", authMiddleware, adminOnly, createProduct);
router.get("/:id", getProductById);
router.patch("/:id", authMiddleware, adminOnly, updateProduct);
router.delete("/:id", authMiddleware, adminOnly, deleteProduct);

export default router;
