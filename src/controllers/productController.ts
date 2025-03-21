import { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  updateProductService,
} from "../services/productServices";

// Create a product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await createProductService(req.body);

    // Fix type checking: Ensure stock and price are numbers
    res.status(201).json({ message: "Product created successfully", product });
    return;
  } catch (error: any) {
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message);
        res
          .status(400)
          .json({ message: "Product validation failed", error: parsedError });
        return;
      } catch {
        res
          .status(500)
          .json({ message: "Error creating product", error: error.message });
        return;
      }
    }

    res.status(500).json({ message: "Unexpected error", error: error });
  }
};

// Get all products
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const category = req.query.category as string | undefined;
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;
    const search = req.query.search as string | undefined;

    const { products, totalProducts } = await getProductsService(
      page,
      limit,
      category,
      minPrice,
      maxPrice,
      search
    );

    console.log(products, totalProducts);

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      pagination: {
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all products", error });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    const product = await getProductByIdService(id);
    console.log("check");

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
    return;
  } catch (error) {
    res.status(400).json({ message: "Error fetching product", error });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedProduct = await updateProductService(req.params.id, req.body);

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
    return;
  } catch (error: any) {
    res.status(error.status || 400).json({
      message: error.message || "Error updating product",
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await deleteProductService(req.params.id);

    res.status(200).json(product);
    return;
  } catch (error: any) {
    res.status(error.status || 400).json({
      message: error.message || "Error deleting product",
    });
  }
};
