import prisma from "../config/database";
import client from "../utils/googleAuth";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid token payload");
    }

    return payload;
  } catch (error) {
    throw new Error("Invalid Google token");
  }
};

export const googleLoginService = async (token: string) => {
  // Verify the token
  const payload = await verifyGoogleToken(token);

  const { sub: googleId, email, name, picture } = payload;

  if (!email) {
    throw new Error("Email not provided by Google");
  }

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    // Link Google ID if not already linked
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { email },
        data: { googleId },
      });
    }
    return user;
  }

  // Create new user if doesn't exist
  user = await prisma.user.create({
    data: {
      email,
      name: name || email,
      googleId,
      role: "CUSTOMER",
      // No password for OAuth users
    },
  });

  return user;
};

export const googleSignupService = async (token: string) => {
  const payload = await verifyGoogleToken(token);

  const { sub: googleId, email, name } = payload;

  if (!email) {
    throw new Error("Email not provided by Google");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      name: name || email,
      googleId,
      role: "CUSTOMER",
    },
    select: { id: true, name: true, email: true, role: true },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

export const generateTokensForUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};
