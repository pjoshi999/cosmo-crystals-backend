import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodTypeAny } from "zod";

const validateRequest =
  (schema: ZodObject<{ [key: string]: ZodTypeAny }>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return; // 🔴 Added return to stop execution after sending response
    }

    next(); // ✅ Calls the next middleware if validation is successful
  };

export default validateRequest;
