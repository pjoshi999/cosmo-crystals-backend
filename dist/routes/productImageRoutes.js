"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productImageController_1 = require("../controllers/productImageController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/create", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, productImageController_1.createProductImage);
router.patch("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, productImageController_1.updateProductImage);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, productImageController_1.deleteProductImage);
exports.default = router;
