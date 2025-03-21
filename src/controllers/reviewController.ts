import { Request, Response } from "express";
import prisma from "../config/database";

export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { rating, comment, productId } = req.body;

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // ✅ Check if the user exists
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      res.status(404).json({ error: "User not found" });
    }

    // ✅ Create a review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId,
      },
      include: { user: true },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Server error while creating review" });
  }
};

export const getAllReviewsForProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { id: productId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching all reviews" });
  }
};

export const deleteReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete review", error });
  }
};
