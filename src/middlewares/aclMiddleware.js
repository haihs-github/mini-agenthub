const aclRepository = require("../repositories/aclRepository");
const prisma = require("../models/prismaClient"); // Cần chọc nhanh qua DB lấy list group của user

const checkACL = (resourceType, action) => {
  // BKAV HaiHS : Middleware kiểm tra ACL động theo từng route và action - start
  return async (req, res, next) => {
    try {
      const userId = req.userId; // Đã có nhờ authMiddleware chạy trước đó
      const resourceId = req.params.id; // Tự động lấy ID đối tượng từ URL (ví dụ: /api/groups/:id)

      if (!resourceId) {
        return res.status(400).json({
          message: "Không tìm thấy ID của đối tượng cần kiểm tra quyền!",
        });
      }

      // 1. Lấy danh sách các ID nhóm mà User này đang tham gia
      const userWithGroups = await prisma.user.findUnique({
        where: { id: userId },
        include: { groups: { select: { id: true } } },
      });
      const groupIds = userWithGroups?.groups.map((g) => g.id) || [];

      // 2. Gọi Repo check bảng ACL thần thánh
      const isAllowed = await aclRepository.hasAccess({
        userId,
        groupIds,
        resourceType,
        resourceId,
        action,
      });

      // 3. Nếu là Admin tối cao, cho qua cửa luôn (Đặc quyền)
      if (req.user && req.user.role === "admin") {
        return next();
      }

      // 4. Kết luận
      if (!isAllowed) {
        return res.status(403).json({
          message: `Bạn không có quyền [${action}] trên đối tượng [${resourceType}] có ID = ${resourceId} này!`,
        });
      }

      next(); // Hợp lệ, mời vào Controller
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi kiểm tra danh sách ACL", error: error.message });
    }
  };
  // BKAV HaiHS : Middleware kiểm tra ACL động theo từng route và action - start
};

module.exports = checkACL;
