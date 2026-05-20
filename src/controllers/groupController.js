const groupService = require("../services/groupService");

class GroupController {
  // BKAV HaiHS : Xử lý tao nhóm mới - start
  async createGroup(req, res, next) {
    try {
      const { name, permissions } = req.body;

      // Kiểm tra dữ liệu đầu vào cơ bản
      if (!name) {
        return res
          .status(400)
          .json({ message: "Bắt buộc phải nhập tên Nhóm (name)!" });
      }

      // Đẩy việc cho Service xử lý
      const result = await groupService.createGroup(name, permissions);

      // Trả về kết quả hoàn chỉnh cho khách
      res.status(201).json({
        message: "Tạo Nhóm thành công!",
        data: result,
      });
    } catch (error) {
      next(error); // Gửi lỗi sang tầng errorHandler gánh
    }
  }
  // BKAV HaiHS : Xử lý tao nhóm mới - end
}

module.exports = new GroupController();
