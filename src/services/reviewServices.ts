import prisma from "../config/database";

export const createReview = async (data: {
  userId: string;
  rating: number;
  productId: string;
  comment: string;
}) => {
  return await prisma.review.create({ data });
};

export const getAllReviewsForProduct = async (productId: string) => {
  return await prisma.review.findMany({
    where: { productId },
    include: { User: { select: { id: true, name: true } } },
  });
};

export const getReviewById = async (id: string) => {
  return await prisma.review.findUnique({ where: { id } });
};

export const deleteReview = async (id: string) => {
  return await prisma.review.delete({ where: { id } });
};
