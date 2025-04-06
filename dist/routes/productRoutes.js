"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", productController_1.getAllProducts);
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, productController_1.createProduct);
router.get("/:id", productController_1.getProductById);
router.patch("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, productController_1.updateProduct);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly, productController_1.deleteProduct);
exports.default = router;
