const userRepository = require("../repositories/userRepository");
const emailService = require("./emailService");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // Thư viện có sẵn của Node.js để tạo chuỗi ngẫu nhiên

class UserService {
  // BKAV HaiHS : tạo người dùng mới - start
  async createUserByAdmin(email, fullname, role, groupId) {
    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error("EMAIL_ALREADY_EXISTS");

    // 2. Định nghĩa sẵn bộ quyền tương ứng với từng Role
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

    const finalRole = rolePermissionMap[role] ? role : "viewer";
    const computedPermissions = rolePermissionMap[finalRole];

    // 3. Sinh mật khẩu tạm thời và mã hóa
    const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 4. Chuẩn bị dữ liệu để lưu vào DB
    const userData = {
      email: email,
      fullname: fullname,
      role: finalRole,
      password: hashedPassword,
      permissions: computedPermissions,
    };

    // NẾU CÓ TRUYỀN GROUP ID -> Thực hiện kết nối mối quan hệ Nhiều - Nhiều của Prisma
    if (groupId) {
      userData.groups = {
        connect: { id: parseInt(groupId) },
      };
    }

    // 5. Gọi Repo lưu xuống Database
    const newUser = await userRepository.create(userData);

    // 6. Gửi Email thông báo (sử dụng cấu hình proxy công ty hiện tại của bạn)
    await emailService.sendWelcomeEmail(email, tempPassword);

    return {
      id: newUser.id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role,
      permissions: newUser.permissions,
      groups: newUser.groups, // Trả ra thông tin nhóm để Frontend hiển thị
    };
  }
  // BKAV HaiHS : tạo người dùng mới - end
}

module.exports = new UserService();
