import prisma from "../config/database";

export const getProfileService = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wishList: {
        include: {
          product: true,
        },
      },
      addresses: true,
      
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return user;
};
