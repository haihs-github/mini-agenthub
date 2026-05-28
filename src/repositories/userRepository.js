const prisma = require("../models/prismaClient");

class UserRepository {
  //  BKAV HaiHS : tìm kiếm người dùng theo email - start
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email: email },
      include: { groups: true },
    });
  }
  //  BKAV HaiHS : tìm kiếm người dùng theo email - end

  //   BKAV HaiHS : tạo người dùng mới - start
  async create(userData) {
    return await prisma.user.create({
      data: userData,
      include: {
        groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  //   BKAV HaiHS : tạo người dùng mới - end

  // BKAV HaiHS : Tìm người dùng theo ID - start
  async findById(id) {
    return await prisma.user.findUnique({
      where: { id: id },
    });
  }
  // BKAV HaiHS : Tìm người dùng theo ID - end

  // BKAV HaiHS : Cập nhật mật khẩu mới vào DB - start
  async updatePassword(id, newHashedPassword) {
    return await prisma.user.update({
      where: { id: id },
      data: { password: newHashedPassword },
    });
  }
  // BKAV HaiHS : Cập nhật mật khẩu mới vào DB - end

  // BKAV HaiHS : Tìm người dùng theo ID kèm theo nhóm và quyền của nhóm - start
  async findByIdWithGroups(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        groups: {
          select: { permissions: true },
        },
      },
    });
  }
  // BKAV HaiHS : Tìm người dùng theo ID kèm theo nhóm và quyền của nhóm - end

  // BKAV HaiHS : tìm kiếm và phân trang người dùng - start
  async findAndCountAll(skip, take) {
    // Chạy song song lệnh lấy danh sách và lệnh đếm tổng số user
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: skip,
        take: take,
        orderBy: { id: "asc" }, // Sắp xếp ID tăng dần
        select: {
          id: true,
          email: true,
          fullname: true,
          permissions: true,
          // Kéo thêm thông tin các nhóm mà user này tham gia (nếu có)
          groups: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }
  // BKAV HaiHS : tìm kiếm và phân trang người dùng - end
}

module.exports = new UserRepository();
