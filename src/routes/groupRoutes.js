const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");

// API Tạo nhóm: Phải Đăng nhập + Có quyền GROUP_C
router.post(
  "/create",
  authMiddleware,
  permissionMiddleware("GROUP_C"),
  groupController.createGroup,
);

// API Sửa quyền của nhóm (GROUP_U) - THÊM DÒNG NÀY:
router.put(
  "/:id/permissions",
  authMiddleware,
  permissionMiddleware("GROUP_U"),
  groupController.updatePermissions,
);

// API Thêm nhiều thành viên vào nhóm (GROUP_ADD_USER):
router.post(
  "/:id/users",
  authMiddleware,
  permissionMiddleware("GROUP_ADD_USER"),
  groupController.addUsers,
);

module.exports = router;
