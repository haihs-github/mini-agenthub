const prisma = require('../models/prismaClient');

class UserRepository {
//  BKAV HaiHS : tìm kiếm người dùng theo email - start
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email: email },
      include: { groups: true }
    });
  }
}
//  BKAV HaiHS : tìm kiếm người dùng theo email - start

module.exports = new UserRepository();