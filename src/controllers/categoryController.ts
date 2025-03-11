import { Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryService,
  updateCategoryService,
} from "../services/categoryServices";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await createCategoryService(req.body);

    res
      .status(201)
      .json({ message: "Category created successfully", category });
    return;
  } catch (error: any) {
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message);
        res
          .status(400)
          .json({ message: "Category validation failed", error: parsedError });
        return;
      } catch {
        res
          .status(500)
          .json({ message: "Error creating category", error: error.message });
        return;
      }
    }

    res.status(500).json({ message: "Unexpected error", error: error });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const result = await getCategoryService(page, limit, search);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error fetching categories", error });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
    return;
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error updating category", error: error.message });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await deleteCategoryService(req.params.id);

    res.status(200).json(category);
    return;
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error deleting category", error: error.message });
  }
};
