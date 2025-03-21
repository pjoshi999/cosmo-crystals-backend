import { Request, Response } from "express";
import {
  createSubCategoryService,
  deleteSubCategoryService,
  getAllSubCategoriesService,
  updateSubCategoryService,
} from "../services/subCategoryServices";

export const createSubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subcategory = await createSubCategoryService(req.body);

    res
      .status(201)
      .json({ message: "SubCategory created successfully", subcategory });
    return;
  } catch (error: any) {
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message);
        res.status(400).json({
          message: "SubCategory validation failed",
          error: parsedError,
        });
        return;
      } catch {
        res.status(500).json({
          message: "Error creating subCategory",
          error: error.message,
        });
        return;
      }
    }

    res.status(500).json({ message: "Unexpected error", error: error });
  }
};

export const getSubCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.query.categoryId as string;

    if (!categoryId) {
      const result = await getAllSubCategoriesService();
      res.status(200).json(result);
      return;
    }

    const result = await getAllSubCategoriesService(categoryId);
    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(400).json({ message: "Error fetching categories", error });
  }
};

export const updateSubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await updateSubCategoryService(req.params.id, req.body);

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

export const deleteSubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await deleteSubCategoryService(req.params.id);

    res.status(200).json(category);
    return;
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error deleting category", error: error.message });
  }
};
