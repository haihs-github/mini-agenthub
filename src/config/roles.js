// src/config/roles.js

// BKAV HaiHS : Định nghĩa ma trận phân quyền hệ thống tổng tập trung - start
const rolePermissionMap = {
  viewer: ["CHAT", "CONV_C", "CONV_R", "CONV_U", "CONV_D"],
  operator: [
    "CHAT",
    "CONV_C",
    "CONV_R",
    "CONV_U",
    "CONV_D",
    "USER_R",
    "GROUP_R",
    "GROUP_ADD_USER",
    "GROUP_DELETE_USER",
  ],
  admin: [
    "USER_C",
    "USER_R",
    "USER_U",
    "USER_D",
    "GROUP_C",
    "GROUP_R",
    "GROUP_U",
    "GROUP_D",
    "GROUP_ADD_USER",
    "GROUP_DELETE_USER",
    "CHAT",
    "CONV_C",
    "CONV_R",
    "CONV_U",
    "CONV_D",
  ],
};
// BKAV HaiHS : Định nghĩa ma trận phân quyền hệ thống tổng tập trung - end

// BKAV HaiHS : Hàm lấy quyền theo role - start
getPermissionsByRole = (role) => {
  return rolePermissionMap[role] || rolePermissionMap.viewer;
};
// BKAV HaiHS : Hàm lấy quyền theo role - end

// BKAV HaiHS : Hàm kiểm tra role có hợp lệ hay không - start
const isValidRole = (role) => {
  return Object.prototype.hasOwnProperty.call(rolePermissionMap, role);
};
// BKAV HaiHS : Hàm kiểm tra role có hợp lệ hay không - end

module.exports = {
  rolePermissionMap,
  getPermissionsByRole,
  isValidRole,
};
