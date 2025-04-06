"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, cartController_1.addToCart);
router.patch("/", authMiddleware_1.authMiddleware, cartController_1.updateCart);
router.get("/", authMiddleware_1.authMiddleware, cartController_1.getCartItems);
router.delete("/:id", authMiddleware_1.authMiddleware, cartController_1.removeFromCart);
exports.default = router;
