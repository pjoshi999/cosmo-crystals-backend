import { addMinutes } from "date-fns";
import prisma from "../config/database";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/passwordHash";
import crypto from "crypto";

export const registerUserService = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
    select: { id: true, name: true, email: true, role: true },
  });

  console.log(newUser);

  const accessToken = generateAccessToken(newUser.id);
  const refreshToken = await generateRefreshToken(newUser.id);
  return { newUser, accessToken, refreshToken };
};

export const loginUserService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found!");

  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  console.log("user", user);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

export const logoutService = async (userId: string) => {
  await prisma.session.deleteMany({ where: { userId } });
  return { message: "Logged out successfully." };
};

export const generatePasswordResetToken = async (userId: string) => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  await prisma.passwordResetToken.upsert({
    where: { userId },
    update: { token: resetToken, expiresAt: addMinutes(new Date(), 30) },
    create: {
      userId,
      token: resetToken,
      expiresAt: addMinutes(new Date(), 30),
    },
  });

  return resetToken;
};
