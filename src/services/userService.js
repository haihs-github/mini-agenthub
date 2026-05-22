const userRepository = require("../repositories/userRepository");
const emailService = require("./emailService");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { getPermissionsByRole, isValidRole } = require("../config/roles");

class UserService {
  // BKAV HaiHS : tạo người dùng mới - start
  async createUserByAdmin(email, fullname, role, groupIds) {
    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error("EMAIL_ALREADY_EXISTS");

    // 2. Sử dụng hàm config tập trung để lấy Role và Quyền sạch sẽ
    const finalRole = isValidRole(role) ? role : "viewer";
    const computedPermissions = getPermissionsByRole(finalRole);

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

    // Nếu truyền groupids
    if (groupIds && Array.isArray(groupIds) && groupIds.length > 0) {
      userData.groups = {
        connect: groupIds.map((id) => ({ id: parseInt(id) })),
      };
    }

    // 5. Gọi Repo lưu xuống Database
    const newUser = await userRepository.create(userData);

    // 6. Gửi Email thông báo qua proxy công ty
    await emailService.sendWelcomeEmail(email, tempPassword);

    return {
      id: newUser.id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role,
      permissions: newUser.permissions,
      groups: newUser.groups,
    };
  }
  // BKAV HaiHS : tạo người dùng mới - end

  // BKAV HaiHS : cập nhật người dùng - start
  async updateUser(userId, { fullname, email, role, groupIds }) {
    // 1. Kiểm tra xem người dùng cần sửa có tồn tại không
    const user = await userRepository.findById(parseInt(userId));
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const updateData = {};

    // 2. Logic check trùng Email
    if (email && email !== user.email) {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
      updateData.email = email;
    }

    // 3. Cập nhật fullname nếu có truyền
    if (fullname) {
      updateData.fullname = fullname;
    }

    // 4. Logic cập nhật Role mới sử dụng bộ config tập trung
    if (role) {
      if (isValidRole(role)) {
        updateData.role = role;
        updateData.permissions = getPermissionsByRole(role); // Tự động lấy mảng quyền tương ứng đổ vào DB
      }
    }

    // 5. Logic cập nhật danh sách Nhóm (Groups)
    if (groupIds && Array.isArray(groupIds)) {
      updateData.groups = {
        set: groupIds.map((id) => ({ id: parseInt(id) })),
      };
    }

    // 6. Gọi Repo thực thi lệnh lưu vào DB
    const updatedUser = await userRepository.update(userId, updateData);

    delete updatedUser.password;
    return updatedUser;
  }
  // BKAV HaiHS : cập nhật người dùng - end
}

module.exports = new UserService();
