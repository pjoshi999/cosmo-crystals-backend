"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => (req, res, next) => {
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
exports.default = validateRequest;
