import { Product } from "@prisma/client";
import prisma from "../config/database";
import { productSchema } from "../validators/productValidator";

export const createProductService = async (
  data: Omit<Product, "id" | "createdAt" | "updatedAt"> & {
    images: { url: string; alt?: string; isMain?: boolean }[];
    attributes: { name: string; value: string }[];
  }
) => {
  const validatedData = productSchema.safeParse(data);

  if (!validatedData.success) {
    console.log(validatedData.error);
    const errors = validatedData.error.format();
    throw new Error(JSON.stringify(errors));
  }

  const category = await prisma.category.findUnique({
    where: { id: validatedData.data.categoryId },
  });

  if (!category) {
    const error = new Error("Category not found") as any;
    error.status = 404;
    throw error;
  }

  const subCategory = await prisma.subCategory.findUnique({
    where: { id: validatedData.data.subCategoryId },
  });

  if (!subCategory) {
    const error = new Error("Subcategory not found") as any;
    error.status = 404;
    throw error;
  }

  if (subCategory?.categoryId !== validatedData.data.categoryId) {
    throw new Error("Subcategory does not belong to the given category");
  }

  const product = await prisma.product.create({
    data: {
      name: validatedData.data.name,
      description: validatedData.data.description ?? "",
      price: validatedData.data.price,
      salePrice: validatedData.data.salePrice,
      stock: validatedData.data.stock,
      // weight: validatedData.data.weight,
      // length: validatedData.data.length,
      // width: validatedData.data.width,
      // height: validatedData.data.height,
      categoryId: validatedData.data.categoryId,
      subCategoryId: validatedData.data.subCategoryId,

      images: {
        create: validatedData.data.images.map((image) => ({
          url: image.url,
          alt: image.alt ?? "",
        })),
      },
      attributes: {
        create: validatedData.data.attributes.map((attr) => ({
          name: attr.name,
          value: attr.value,
        })),
      },
    },
    include: {
      images: true,
      attributes: true,
      category: true,
      subCategory: true,
    },
  });

  return product;
};

export const getProductsService = async (
  page: number,
  limit: number,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const filters: any = {};

  if (category) {
    filters.category = {
      name: {
        equals: category,
        mode: "insensitive",
      },
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filters.price = {};

    if (minPrice !== undefined) {
      filters.price.gte = minPrice; // Greater than or equal to minPrice
    }

    if (maxPrice !== undefined) {
      filters.price.lte = maxPrice; // Less than or equal to maxPrice
    }
  }

  if (search) {
    filters.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  console.log(filters);

  const products = await prisma.product.findMany({
    where: filters,
    include: {
      images: true,
      attributes: {
        select: {
          name: true,
          value: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
        },
      },
      subCategory: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Show latest products first
    },
    skip,
    take: limit,
  });

  const totalProducts = await prisma.product.count({ where: filters });

  return { products, totalProducts };
};

export const getProductByIdService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      attributes: true,
      category: true,
      subCategory: true,
    },
  });

  return product;
};

export const updateProductService = async (
  id: string,
  data: Partial<Product>
) => {
  const validatedData = productSchema.partial().safeParse(data);

  if (!validatedData.success) {
    const errors = validatedData.error.format();
    throw new Error(JSON.stringify(errors));
  }

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    const error = new Error("Product not found") as any;
    error.status = 404; // Set HTTP status for better error handling
    throw error;
  }

  return await prisma.product.update({
    where: { id },
    data: {
      ...validatedData.data,
      categoryId: validatedData.data.categoryId,
      subCategoryId: validatedData.data.subCategoryId,
      images: validatedData.data.images
        ? {
            deleteMany: {},
            create: validatedData.data.images.map((image) => ({
              url: image.url,
              alt: image.alt ?? "",
            })),
          }
        : undefined,
      attributes: validatedData.data.attributes
        ? {
            deleteMany: {},
            create: validatedData.data.attributes.map((attr) => ({
              name: attr.name,
              value: attr.value,
            })),
          }
        : undefined,
    },
  });
};

export const deleteProductService = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    const error = new Error("Product not found") as any;
    error.status = 404;
    throw error;
  }

  await prisma.product.delete({ where: { id } });

  return { message: "Product deleted successfully" };
};
