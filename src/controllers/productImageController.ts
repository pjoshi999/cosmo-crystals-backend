import { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  updateProductService,
} from "../services/productServices";
import {
  createProductImageService,
  deleteProductImageService,
  updateProductImageService,
} from "../services/productImageServices";

export const createProductImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, url } = req.body;

    if (!productId) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }
    if (!url) {
      res.status(400).json({ error: "Product Image URL is required" });
      return;
    }

    const product = await createProductImageService(req.body);

    // Fix type checking: Ensure stock and price are numbers
    res
      .status(201)
      .json({ message: "Product Image created successfully", product });
    return;
  } catch (error: any) {
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message);
        res.status(400).json({
          message: "Product Image validation failed",
          error: parsedError,
        });
        return;
      } catch {
        res.status(500).json({
          message: "Error creating product image",
          error: error.message,
        });
        return;
      }
    }

    res.status(500).json({ message: "Unexpected error", error: error });
  }
};

export const updateProductImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedProduct = await updateProductImageService(
      req.params.id,
      req.body
    );

    res
      .status(200)
      .json({ message: "Product Image updated successfully", updatedProduct });
    return;
  } catch (error: any) {
    res.status(error.status || 400).json({
      message: error.message || "Error updating product image",
    });
  }
};

export const deleteProductImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await deleteProductImageService(req.params.id);

    res.status(200).json(product);
    return;
  } catch (error: any) {
    res.status(error.status || 400).json({
      message: error.message || "Error deleting product image",
    });
  }
};
