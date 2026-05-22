const groupService = require("../services/groupService");

class GroupController {
  // BKAV HaiHS : Xử lý tao nhóm mới - start
  async createGroup(req, res, next) {
    try {
      const { name, permissions, userIds } = req.body;
      const creatorId = req.userId;

      // Kiểm tra dữ liệu đầu vào cơ bản
      if (!name) {
        return res
          .status(400)
          .json({ message: "Bắt buộc phải nhập tên Nhóm (name)!" });
      }

      // Validate: Nếu có gửi permissions thì bắt buộc phải là mảng
      if (permissions && !Array.isArray(permissions)) {
        return res.status(400).json({
          message: "Dữ liệu permissions truyền lên phải là một mảng!",
        });
      }

      // Validate: Nếu có gửi userIds thì bắt buộc phải là mảng
      if (userIds && !Array.isArray(userIds)) {
        return res.status(400).json({
          message:
            "Dữ liệu userIds truyền lên phải là một mảng các số nguyên (ID người dùng)!",
        });
      }

      // Đẩy việc cho Service xử lý
      const result = await groupService.createGroup(
        name,
        permissions,
        userIds,
        creatorId,
      );

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

  //   BKAV HaiHS : xử lý cập nhật quyền cho nhóm - start
  async updateGroup(req, res, next) {
    try {
      const { id } = req.params; // Lấy ID nhóm từ URL
      const { name, permissions } = req.body; // Lấy Tên mới và Quyền mới từ Body

      // Validate: Nếu có truyền permissions thì bắt buộc phải là mảng
      if (permissions && !Array.isArray(permissions)) {
        return res.status(400).json({
          message: "Dữ liệu permissions truyền lên bắt buộc phải là một mảng!",
        });
      }

      // Đẩy việc xuống cho Service xử lý
      const result = await groupService.updateGroup(id, name, permissions);

      res.status(200).json({
        message: "Cập nhật thông tin Nhóm thành công!",
        data: result,
      });
    } catch (error) {
      next(error); // Đẩy lỗi ra errorHandler gánh
    }
  }
  //   BKAV HaiHS : xử lý cập nhật quyền cho nhóm - end

  // BKAV HaiHS : xử lý thêm người dùng vào nhóm - start
  async addUsers(req, res, next) {
    try {
      const { id } = req.params; // Lấy ID Nhóm từ URL
      const { userIds } = req.body; // Lấy mảng ID người dùng từ Body

      // Kiểm tra dữ liệu đầu vào bắt buộc phải là mảng
      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({
          message: "Dữ liệu userIds truyền lên bắt buộc phải là một mảng!",
        });
      }

      // Gọi Service xử lý
      const result = await groupService.addUsersToGroup(id, userIds);

      res.status(200).json({
        message: "Thêm các thành viên vào Nhóm thành công!",
        data: result,
      });
    } catch (error) {
      next(error); // Gửi lỗi sang errorHandler gánh
    }
  }
  // BKAV HaiHS : xử lý thêm người dùng vào nhóm - end
}

module.exports = new GroupController();
