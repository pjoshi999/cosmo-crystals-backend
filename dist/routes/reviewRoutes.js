"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const reviewValidator_1 = require("../validators/reviewValidator");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(reviewValidator_1.reviewSchema), reviewController_1.createReview);
router.get("/:productId", reviewController_1.getAllReviewsForProduct);
router.delete("/:id", reviewController_1.deleteReview);
exports.default = router;
