import express from "express";
import {
  createProductImage,
  deleteProductImage,
  updateProductImage,
} from "../controllers/productImageController";

const router = express.Router();

router.post("/create", createProductImage);
router.patch("/:id", updateProductImage);
router.delete("/:id", deleteProductImage);

export default router;
