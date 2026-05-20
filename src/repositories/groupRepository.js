const prisma = require("../models/prismaClient");

class GroupRepository {
  // BKAV HaiHS : Tìm kiếm nhóm theo tên - start
  async findByName(name) {
    return await prisma.group.findUnique({
      where: { name: name },
    });
  }
  // BKAV HaiHS : Tìm kiếm nhóm theo tên - end

  // BKAV HaiHS :Lưu nhóm mới vào Database - start
  async create(groupData) {
    return await prisma.group.create({
      data: groupData,
    });
  }
  // BKAV HaiHS :Lưu nhóm mới vào Database - end
}

module.exports = new GroupRepository();
