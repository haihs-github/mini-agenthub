const userService = require("../services/userService");

class UserController {
  // BKAV HaiHS : tạo người dùng mới - start
  async createUser(req, res, next) {
    try {
      // Đón nhận thêm thuộc tính groupId từ client gửi lên
      const { email, fullname, role, groupId } = req.body;

      // Chỉ validate bắt buộc 3 trường cốt lõi này
      if (!email || !fullname || !role) {
        return res.status(400).json({
          message:
            "Vui lòng nhập đầy đủ các thông tin bắt buộc: email, fullname, và role (admin/operator/viewer)!",
        });
      }

      // Giao việc cho Service (truyền cả groupId qua, có thể mang giá trị undefined nếu client không gửi)
      const result = await userService.createUserByAdmin(
        email,
        fullname,
        role,
        groupId,
      );

      res.status(201).json({
        message: "Tạo tài khoản phân quyền và gán Nhóm thành công!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  // BKAV HaiHS : tạo người dùng mới - end
}

module.exports = new UserController();
