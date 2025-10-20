import { Request, Response } from "express";
import {
  generateTokensForUser,
  googleLoginService,
  googleSignupService,
} from "../services/googleAuthServices";

// @desc    Google Login/Signup
// @route   POST /api/v1/auth/google
// @access  Public
export const googleAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: "Google token is required" });
      return;
    }

    // Try to login existing user
    const user = await googleLoginService(token);

    // Generate tokens
    const {
      user: userData,
      accessToken,
      refreshToken,
    } = await generateTokensForUser(user.id);

    res.status(200).json({
      message: "Google login successful",
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Google Signup
// @route   POST /api/v1/auth/google/signup
// @access  Public
export const googleSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: "Google token is required" });
      return;
    }

    const { user, accessToken, refreshToken } = await googleSignupService(
      token
    );

    res.status(201).json({
      message: "Google signup successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
