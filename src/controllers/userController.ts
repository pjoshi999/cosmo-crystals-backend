import { Request, Response } from "express";
import { getUsersService } from "../services/userServices";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsersService();
    res.status(201).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
