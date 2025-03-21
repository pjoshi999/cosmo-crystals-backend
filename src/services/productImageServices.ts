import { ProductImage } from "@prisma/client";
import prisma from "../config/database";
import { productImageSchema } from "../validators/productValidator";

export const createProductImageService = async (data: ProductImage) => {
  const validatedData = productImageSchema.safeParse(data);

  if (!validatedData.success) {
    console.log(validatedData.error);
    const errors = validatedData.error.format();
    throw new Error(JSON.stringify(errors));
  }

  // if the image is set as main, update all other images to false
  if (validatedData.data.isMain) {
    await prisma.productImage.updateMany({
      where: {
        productId: validatedData.data.productId,
        isMain: true,
      },
      data: { isMain: false },
    });
  }

  // create product image
  const productImage = await prisma.productImage.create({
    data: validatedData.data,
  });

  return productImage;
};

export const updateProductImageService = async (
  id: string,
  data: Partial<ProductImage>
) => {
  const validatedData = productImageSchema.partial().safeParse(data);

  if (!validatedData.success) {
    const errors = validatedData.error.format();
    throw new Error(JSON.stringify(errors));
  }

  const productImage = await prisma.productImage.findUnique({ where: { id } });

  if (!productImage) {
    const error = new Error("Product image not found") as any;
    error.status = 404;
    throw error;
  }

  // if the image is set as main, update all other images to false
  if (validatedData.data?.isMain) {
    await prisma.productImage.updateMany({
      where: {
        productId: validatedData.data.productId,
        isMain: true,
      },
      data: { isMain: false },
    });
  }

  return await prisma.productImage.update({
    where: { id },
    data: validatedData.data,
  });
};

export const deleteProductImageService = async (id: string) => {
  const productImage = await prisma.productImage.findUnique({ where: { id } });

  if (!productImage) {
    const error = new Error("Product image not found") as any;
    error.status = 404;
    throw error;
  }

  await prisma.productImage.delete({ where: { id } });

  return { message: "Product Image deleted successfully" };
};
