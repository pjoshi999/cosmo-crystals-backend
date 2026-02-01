import { Request, Response } from "express";
import {
  addToCartService,
  getCartItemsService,
  removeFromCartService,
  updateCartService,
} from "../services/cartServices";

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const cartItem = await addToCartService(req.user?.id, productId, quantity);
    res.status(201).json(cartItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cartItems = await getCartItemsService(req.user?.id);
    res.status(200).json(cartItems);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const cartItem = await updateCartService(req.user?.id, productId, quantity);
    res.status(200).json(cartItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }

    const cartItem = await removeFromCartService(req.user?.id, id);
    res.status(200).json(cartItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
