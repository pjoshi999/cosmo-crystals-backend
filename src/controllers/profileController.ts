import { Request, Response } from "express";
import { getProfileService } from "../services/profileServices";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  const user = await getProfileService(userId);
  res.status(200).json(user);
};
