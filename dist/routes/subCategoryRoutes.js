"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subCategoryController_1 = require("../controllers/subCategoryController");
const router = express_1.default.Router();
router.get("/", subCategoryController_1.getSubCategories);
router.post("/create-subcategory", subCategoryController_1.createSubCategory);
router.patch("/:id", subCategoryController_1.updateSubCategory);
router.delete("/:id", subCategoryController_1.deleteSubCategory);
exports.default = router;
