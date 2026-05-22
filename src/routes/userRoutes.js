const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const userController = require("../controllers/userController");

// API: Admin tạo User mới
router.post(
  "/create",
  authMiddleware,
  permissionMiddleware("USER_C"),
  userController.createUser,
);

// API Cập nhật thông tin tài khoản
router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("USER_U", "GROUP_ADD_USER", "GROUP_DELETE_USER"),
  userController.updateUser,
);

module.exports = router;
