"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productImageController_1 = require("../controllers/productImageController");
const router = express_1.default.Router();
router.post("/create", productImageController_1.createProductImage);
router.patch("/:id", productImageController_1.updateProductImage);
router.delete("/:id", productImageController_1.deleteProductImage);
exports.default = router;
