import { User } from "@prisma/client";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: "ADMIN" | "CUSTOMER";
    };
  }
}
