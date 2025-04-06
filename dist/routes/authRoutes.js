"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const authValidator_1 = require("../validators/authValidator");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/signup", (0, validateRequest_1.default)(authValidator_1.signUpSchema), authController_1.registerUser);
router.post("/login", (0, validateRequest_1.default)(authValidator_1.loginSchema), authController_1.loginUser);
router.post("/refresh", authController_1.refreshAccessToken);
router.post("/forgot-password", authController_1.forgotPassword);
router.post("/reset-password", authController_1.resetPassword);
router.post("/logout", authMiddleware_1.authMiddleware, authController_1.logout);
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
exports.default = router;
