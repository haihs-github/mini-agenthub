// Nạp userRepository vào đúng chuẩn kiến trúc đa tầng
const userRepository = require("../repositories/userRepository");

// BKAV HaiHS : Middleware kiểm tra quyền - start
const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // 1. Lấy userId từ authMiddleware đã gài cắm trước đó
      const userId = req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({
            message: "Không tìm thấy thông tin xác thực. Vui lòng đăng nhập!",
          });
      }

      // 2. Gọi tầng Repository chọc vào DB lấy dữ liệu mới nhất ngay tại thời điểm gọi API
      const user = await userRepository.findByIdWithGroups(userId);

      // Phòng trường hợp tài khoản vô tình bị xóa trong lúc đang đăng nhập
      if (!user) {
        return res
          .status(404)
          .json({
            message: "Tài khoản của bạn không còn tồn tại trên hệ thống!",
          });
      }

      // 3. Thuật toán hợp nhất quyền hạn (Realtime)
      const userPerms = user.permissions || [];
      const groupPerms = user.groups
        ? user.groups.flatMap((g) => g.permissions)
        : [];

      // Gộp 2 mảng lại và loại bỏ các phần tử trùng lặp bằng Set
      const effectivePermissions = [...new Set([...userPerms, ...groupPerms])];

      console.log(
        `[Realtime Auth] User ${user.email} đang có các quyền:`,
        effectivePermissions,
      );

      // 4. Tiến hành so khớp với quyền yêu cầu của Route
      if (!effectivePermissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: `Bạn không có quyền thực hiện hành động này! (Yêu cầu quyền: ${requiredPermission})`,
        });
      }

      // Đính kèm danh sách quyền realtime này vào req để các tầng sau (nếu cần) có thể dùng luôn
      req.effectivePermissions = effectivePermissions;

      next(); // Hợp lệ, mở cửa cho Request chạy thẳng vào tầng Controller!
    } catch (error) {
      // Nếu có lỗi phát sinh (ví dụ mất kết nối DB), đẩy thẳng ra errorHandler gánh
      next(error);
    }
  };
};
// BKAV HaiHS : Middleware kiểm tra quyền - end

module.exports = permissionMiddleware;
