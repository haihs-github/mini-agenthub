const userService = require("../services/userService");

class UserController {
  // BKAV HaiHS : tạo người dùng mới - start
  async createUser(req, res, next) {
    try {
      const { email, fullname, groupIds } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Bắt buộc phải nhập Email!" });
      }

      // Giao việc cho Service
      const result = await userService.createUserByAdmin(
        email,
        fullname,
        groupIds,
      );

      res.status(201).json({
        message: "Tạo tài khoản và gửi Email thành công!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  // BKAV HaiHS : tạo người dùng mới - end

  // BKAV HaiHS : lấy danh sách người dùng phân trang - start
  async getAllUsers(req, res, next) {
    try {
      // Lấy tham số dạng: /api/users?page=1&limit=10
      let { page, limit } = req.query;

      // Ép kiểu về số nguyên và set mặc định
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      if (page < 1) page = 1;
      if (limit < 1) limit = 10;

      // Gọi Service làm việc
      const result = await userService.getAllUsers(page, limit);

      // Trả response
      res.status(200).json({
        message: "Lấy danh sách người dùng thành công!",
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  // BKAV HaiHS : lấy danh sách người dùng phân trang - end
}

module.exports = new UserController();
