import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../config/database";
import { addDays } from "date-fns";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET || "maverick";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "maverick-refresh";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = async (userId: string) => {
  console.log("userId", userId);

  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "15d",
  });

  console.log("refresh", refreshToken);

  await prisma.session.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: addDays(new Date(), 15),
    },
  });

  return refreshToken;
};

export const verifyAccessToken = (accessToken: string) => {
  return jwt.verify(accessToken, ACCESS_SECRET);
};

export const verifyRefreshToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }

    console.log("decoded", decoded);
    console.log("refresh token", refreshToken);

    const storedSession = await prisma.session.findFirst({
      where: {
        userId: decoded.userId,
        token: refreshToken,
        expiresAt: { gt: new Date() },
      },
    });

    console.log(storedSession);

    if (!storedSession) {
      throw new Error("Invalid or expired refresh token");
    }

    return decoded;
  } catch (error: any) {
    throw new Error(`Invalid refresh token: ${error.message}`);
  }
};
