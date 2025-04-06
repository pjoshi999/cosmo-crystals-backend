"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const profileServices_1 = require("../services/profileServices");
const getUserProfile = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const user = await (0, profileServices_1.getProfileService)(userId);
    res.status(200).json(user);
};
exports.getUserProfile = getUserProfile;
