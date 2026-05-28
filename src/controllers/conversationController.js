const conversationService = require("../services/conversationService");

class ConversationController {
  // BKAV HaiHS : controller Tạo phòng - start
  async createConversation(req, res, next) {
    try {
      const userId = req.userId;
      const { title } = req.body;
      const result = await conversationService.createConversation(
        userId,
        title,
      );
      res.status(201).json({
        message: "Khởi tạo cuộc hội thoại mới thành công!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  // BKAV HaiHS : controller Tạo phòng - end

  // BKAV HaiHS : controller Lấy lịch sử chat - start
  async getMyConversations(req, res, next) {
    try {
      const userId = req.userId; // Cứ lấy từ Token ra dùng, an toàn tuyệt đối
      let { page, limit } = req.query;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const result = await conversationService.getUserConversations(
        userId,
        page,
        limit,
      );
      res.status(200).json({
        message: "Lấy danh sách cuộc hội thoại thành công!",
        data: result.conversations,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  // BKAV HaiHS : controller Lấy lịch sử chat - end

  // 3. BKAV HaiHS : controller Lấy chi tiết khung chat - start
  async getConversationDetail(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId; // Lấy ID chính mình để đối chiếu độc quyền

      const result = await conversationService.getConversationDetail(
        id,
        userId,
      );
      res.status(200).json({
        message: "Lấy chi tiết cuộc hội thoại thành công!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  // 3. BKAV HaiHS : controller Lấy chi tiết khung chat - start
}

module.exports = new ConversationController();
