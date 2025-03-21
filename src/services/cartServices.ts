import prisma from "../config/database";

export const addToCartService = async (
  userId: string | undefined,
  productId: string,
  quantity: number
) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!quantity) {
    throw new Error("Quantity is required");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be greater than 0");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found") as any;
    error.status = 404;
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    const error = new Error("Product not found") as any;
    error.status = 404;
    throw error;
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { productId: productId, userId: userId },
  });

  if (cartItem) {
    throw new Error("Product already in cart");
  }

  const newCartItem = await prisma.cartItem.create({
    data: {
      quantity,
      user: {
        connect: { id: userId },
      },
      product: {
        connect: { id: productId },
      },
    },
    include: { product: true },
  });

  return newCartItem;
};

export const getCartItemsService = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
  });

  return cartItems;
};

export const updateCartService = async (
  userId: string | undefined,
  productId: string,
  quantity: number
) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!quantity) {
    throw new Error("Quantity is required");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be greater than 0");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found") as any;
    error.status = 404;
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    const error = new Error("Product not found") as any;
    error.status = 404;
    throw error;
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { productId: productId, userId: userId },
  });

  if (!cartItem) {
    throw new Error("Product not found in cart");
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: {
      quantity,
    },
    include: { product: true },
  });

  return updatedCartItem;
};

export const removeFromCartService = async (
  userId: string | undefined,
  productId: string
) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found") as any;
    error.status = 404;
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    const error = new Error("Product not found") as any;
    error.status = 404;
    throw error;
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { productId },
  });

  if (!cartItem) {
    throw new Error("Product is not added in cart");
  }

  await prisma.cartItem.delete({
    where: { userId_productId: { userId: userId, productId: productId } },
  });

  return { message: "Product removed from cart successfully" };
};
