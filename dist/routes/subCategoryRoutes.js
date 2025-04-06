"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subCategoryController_1 = require("../controllers/subCategoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", subCategoryController_1.getSubCategories);
router.post("/create-subcategory", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, subCategoryController_1.createSubCategory);
router.patch("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, subCategoryController_1.updateSubCategory);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, subCategoryController_1.deleteSubCategory);
exports.default = router;
