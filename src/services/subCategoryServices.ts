import prisma from "../config/database";
import { subCategorySchema } from "../validators/subCategoryValidator";

export const createSubCategoryService = async (data: {
  name: string;
  slug?: string;
  categoryId: string;
}) => {
  const validatedData = subCategorySchema.safeParse(data);

  if (!validatedData.success) {
    const errors = validatedData.error.format();
    throw new Error(JSON.stringify(errors));
  }

  const category = await prisma.category.findUnique({
    where: { id: validatedData.data.categoryId },
  });

  if (!category) {
    const error = new Error("Category not found!") as any;
    error.status = 404;
    throw error;
  }

  const slug =
    validatedData.data.slug ||
    validatedData.data.name.toLowerCase().replace(/\s+/g, "-");

  const subCategory = await prisma.subCategory.create({
    data: {
      name: validatedData.data.name,
      slug: slug,
      categoryId: validatedData.data.categoryId,
    },
    include: { category: true },
  });

  return subCategory;
};

export const getAllSubCategoriesService = async (categoryId?: string) => {
  const subCategories = await prisma.subCategory.findMany({
    where: categoryId ? { id: categoryId } : {},
    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
        },
      },
    },
    orderBy: { name: "desc" },
  });

  return subCategories;
};

export const getAllSubCategoryByIdService = async (subCategoryId: string) => {
  const subCategory = await prisma.subCategory.findUnique({
    where: { id: subCategoryId },
    include: { category: true },
  });

  return subCategory;
};

export const updateSubCategoryService = async (
  subCategoryId: string,
  data: Partial<{ name: string; slug: string; categoryId: string }>
) => {
  const subCategory = await prisma.subCategory.findUnique({
    where: { id: subCategoryId },
    include: { category: true },
  });

  if (!subCategory) {
    const error = new Error("SubCategory not found") as any;
    error.status = 404;
    throw error;
  }

  const validatedData = subCategorySchema.partial().safeParse(data);

  if (!validatedData.success) {
    const errors = validatedData.error.format();
    throw new Error(JSON.stringify(errors));
  }

  return prisma.subCategory.update({
    where: { id: subCategoryId },
    data: validatedData.data,
    include: { category: true },
  });
};

export const deleteSubCategoryService = async (subCategoryId: string) => {
  const subCategory = await prisma.subCategory.findUnique({
    where: { id: subCategoryId },
  });

  if (!subCategory) {
    const error = new Error("SubCategory not found!") as any;
    error.status = 404;
    throw error;
  }

  await prisma.subCategory.delete({
    where: { id: subCategoryId },
  });

  return { message: "SubCategory deleted successfully" };
};
