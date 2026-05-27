const groupRepository = require("../repositories/groupRepository");

class GroupService {
  // BKAV HaiHS : sử lý tạo nhóm mới - start
  async createGroup(name, permissions, userIds) {
    // Kiểm tra xem tên nhóm đã tồn tại chưa
    const existingGroup = await groupRepository.findByName(name);
    if (existingGroup) {
      throw new Error("GROUP_ALREADY_EXISTS");
    }

    // đóng gói groupdata
    const groupData = {
      name: name,
      permissions: permissions || [],
    };

    // gán user vào nhóm nếu có
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      groupData.users = {
        // Biến mảng số [1, 2] thành dạng [{ id: 1 }, { id: 2 }] theo đúng chuẩn Prisma
        connect: userIds.map((id) => ({ id: parseInt(id) })),
      };
    }

    return await groupRepository.create(groupData);
  }
  // BKAV HaiHS : sử lý tạo nhóm mới - end

  //   BKAV HaiHS : xử lý cập nhật quyền cho nhóm - start
  async updateGroupPermissions(groupId, permissions) {
    // 1. Kiểm tra xem nhóm có tồn tại trong hệ thống không
    const group = await groupRepository.findById(groupId);
    if (!group) {
      throw new Error("GROUP_NOT_FOUND");
    }

    // 2. Gọi Repo để cập nhật mảng quyền mới
    const updatedGroup = await groupRepository.updatePermissions(
      groupId,
      permissions,
    );
    return updatedGroup;
  }
  //   BKAV HaiHS : xử lý cập nhật quyền cho nhóm - end

  // BKAV HaiHS : xử lý thêm người dùng vào nhóm - start
  async addUsersToGroup(groupId, userIds) {
    // 1. Kiểm tra xem Nhóm có tồn tại thật không
    const group = await groupRepository.findById(groupId);
    if (!group) {
      throw new Error("GROUP_NOT_FOUND");
    }

    // 2. Kiểm tra xem mảng userIds có rỗng không
    if (!userIds || userIds.length === 0) {
      throw new Error("USER_IDS_REQUIRED");
    }

    // 3. Tiến hành gán danh sách User vào Nhóm
    return await groupRepository.addUsersToGroup(groupId, userIds);
  }
  // BKAV HaiHS : xử lý thêm người dùng vào nhóm - end
}

module.exports = new GroupService();
