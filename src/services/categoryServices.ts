import prisma from "../config/database";
import { categorySchema } from "../validators/categoryValidator";

export const createCategoryService = async (data: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
}) => {
  const validatedData = categorySchema.safeParse(data);

  if (!validatedData.success) {
    console.log(validatedData.error);
    const errors = validatedData.error.format();
    throw new Error(JSON.stringify(errors));
  }

  const slug =
    validatedData.data.slug ||
    validatedData.data.name.toLowerCase().replace(/\s+/g, "-");

  const category = await prisma.category.create({
    data: {
      name: validatedData.data.name,
      description: validatedData.data.description ?? "",
      slug: slug ?? "",
      image: validatedData.data.image ?? "",
    },
  });

  return category;
};

export const getCategoryService = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  const skip = (page - 1) * limit;

  const categories = await prisma.category.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const totalCategories = await prisma.category.count();

  return {
    categories,
    totalPage: Math.ceil(totalCategories / limit),
    currentPage: page,
  };
};

export const getCategoryByIdService = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategoryService = async (
  id: string,
  data: Partial<{
    name: string;
    slug?: string;
    description?: string;
    image?: string;
  }>
) => {
  const validatedData = categorySchema.partial().safeParse(data);

  if (!validatedData.success) {
    const errors = validatedData.error.format();
    throw new Error(JSON.stringify(errors));
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: validatedData.data,
  });

  return updatedCategory;
};

export const deleteCategoryService = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({ where: { id } });

  return { message: "Category deleted successfully" };
};
