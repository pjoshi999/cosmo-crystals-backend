import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCart,
} from "../controllers/cartController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, addToCart);
router.patch("/", authMiddleware, updateCart);
router.get("/", authMiddleware, getCartItems);
router.delete("/:id", authMiddleware, removeFromCart);

export default router;
