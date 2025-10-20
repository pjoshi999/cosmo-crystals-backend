import express, { Request, Response } from "express";
import validateRequest from "../middlewares/validateRequest";
import { loginSchema, signUpSchema } from "../validators/authValidator";
import {
  forgotPassword,
  loginUser,
  logout,
  refreshAccessToken,
  registerUser,
  resetPassword,
} from "../controllers/authController";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware";
import { googleAuth, googleSignup } from "../controllers/googleAuthController";

const router = express.Router();

router.post("/signup", validateRequest(signUpSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", authMiddleware, logout);

router.post("/google", googleAuth);
router.post("/google/signup", googleSignup);

// Protect this route → Only logged-in users can access
// router.get("/profile", authMiddleware, (req: Request, res: Response) => {
//   res.json({
//     message: `Hello ${req.user?.id}, your role is ${req.user?.role}`,
//   });
// });

// Admin-only route
// router.get(
//   "/admin/dashboard",
//   authMiddleware,
//   adminOnly,
//   (_req: Request, res: Response) => {
//     res.json({ message: "Welcome, Admin!" });
//   }
// );

export default router;
