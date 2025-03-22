import express from "express";
import { getUserProfile } from "../controllers/profileController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getUserProfile);

export default router;
