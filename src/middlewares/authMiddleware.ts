import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import prisma from "../config/database";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "Unauthorized. Token missing." });
      return;
    }

    const decoded = verifyAccessToken(token);

    if (typeof decoded === "string" || !decoded.id) {
      res.status(401).json({ error: "Unauthorized. Invalid token." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true },
    });

    if (!user) {
      res.status(401).json({ error: "Unauthorized. User not found." });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Access denied. Admins only." });
    return;
  }
  next();
};
