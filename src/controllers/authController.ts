import { Request, Response } from "express";
import {
  generatePasswordResetToken,
  loginUserService,
  logoutService,
  registerUserService,
} from "../services/authServices";
import { loginSchema, signUpSchema } from "../validators/authValidator";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import prisma from "../config/database";
import { sendResetEmail } from "../utils/emailService";
import { hashPassword } from "../utils/passwordHash";

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedData = signUpSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return;
    }

    const { name, email, password } = parsedData.data;

    const { newUser, accessToken, refreshToken } = await registerUserService(
      name,
      email,
      password
    );

    res.status(200).json({
      message: "User registered successfully",
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = loginSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return;
    }

    const { email, password } = parsedData.data;
    const { accessToken, refreshToken } = await loginUserService(
      email,
      password
    );
    res.status(200).json({
      message: "Login successfully",
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is required" });
      return;
    }

    const decoded = await verifyRefreshToken(refreshToken);

    console.log("check", decoded);

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = await generateRefreshToken(user.id);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = await generatePasswordResetToken(user.id);

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetLink);

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { resetToken, newPassword } = req.body;

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: resetToken },
    });

    if (!resetToken || !resetRecord || resetRecord.expiresAt < new Date()) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.delete({ where: { token: resetToken } });

    res.status(200).json({ message: "Password reset successful" });

    await prisma.session.deleteMany({
      where: { userId: resetRecord.userId },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await logoutService(userId);

    res.status(200).json({ message: "Logged out successfully." });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
