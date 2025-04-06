"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", categoryController_1.getCategories);
router.post("/create-category", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, categoryController_1.createCategory);
router.patch("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, categoryController_1.updateCategory);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, categoryController_1.deleteCategory);
exports.default = router;
