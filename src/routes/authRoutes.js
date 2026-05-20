const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

// API đăng nhập
router.post("/login", authController.login);

// API đổi mật khẩu
router.put("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
