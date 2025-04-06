import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware";
import { getUsers } from "../controllers/userController";

const router = express.Router();

router.get("/", authMiddleware, adminOnly, getUsers);

export default router;
