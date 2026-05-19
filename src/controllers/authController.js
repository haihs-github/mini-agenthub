const authService = require('../services/authService');

class AuthController {
//  BKAV HaiHS : xử lý đăng nhập - start
  async login(req, res, next) {
    try {
      // 1. Lấy dữ liệu từ Client
      const { email, password } = req.body;

      // Validate cơ bản (Có thể dùng thư viện Zod sau này)
      if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ Email và Mật khẩu" });
      }

      // 2. Giao việc cho Service
      const result = await authService.login(email, password);

      // 3. Trả Response thành công
      res.status(200).json({
        message: "Đăng nhập thành công!",
        data: result
      });

    } catch (error) {
      // Nếu Service ném ra lỗi, chuyển thẳng lỗi đó đến Middleware Error Handler
      next(error); 
    }
  }
//  BKAV HaiHS : xử lý đăng nhập - end
}

module.exports = new AuthController();