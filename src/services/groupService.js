const groupRepository = require("../repositories/groupRepository");
const aclRepository = require("../repositories/aclRepository");
class GroupService {
  // BKAV HaiHS : sử lý tạo nhóm mới - start
  async createGroup(name, permissions, userIds, creatorId) {
    // 1. Kiểm tra xem tên nhóm đã tồn tại chưa
    const existingGroup = await groupRepository.findByName(name);
    if (existingGroup) {
      throw new Error("GROUP_ALREADY_EXISTS");
    }

    // 2. Chuẩn bị dữ liệu thô cho nhóm
    const groupData = {
      name: name,
      permissions: permissions || [],
    };

    // 3. Nếu có truyền mảng userIds và mảng có chứa phần tử -> tiến hành connect
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      groupData.users = {
        connect: userIds.map((id) => ({ id: parseInt(id) })),
      };
    }

    // 4. Gọi Repo để lưu xuống Database
    const newGroup = await groupRepository.create(groupData);

    await aclRepository.createACL({
      userId: parseInt(creatorId), // ID của người đang thao tác
      resourceType: "Group", // Loại tài nguyên
      resourceId: newGroup.id, // ID của Group vừa sinh ra trong DB
      action:
        "GROUP_C, GROUP_R, GROUP_U, GROUP_D, GROUP_ADD_USER, GROUP_DELETE_USER", // Cấp quyền sửa/vận hành nhóm này
    });
  }
  // BKAV HaiHS : sử lý tạo nhóm mới - end

  //   BKAV HaiHS : xử lý cập nhật nhóm - start
  async updateGroup(groupId, name, permissions) {
    // 1. Kiểm tra xem nhóm có tồn tại trong hệ thống không
    const group = await groupRepository.findById(groupId);
    if (!group) {
      throw new Error("GROUP_NOT_FOUND");
    }

    const updateData = {};

    // 2. LOGIC CHECK TRÙNG TÊN: Nếu có truyền tên mới VÀ tên mới khác tên cũ
    if (name && name !== group.name) {
      const existingGroup = await groupRepository.findByName(name);
      if (existingGroup) {
        throw new Error("GROUP_ALREADY_EXISTS");
      }
      updateData.name = name; // Hợp lệ thì đưa vào object cập nhật
    }

    // 3. Nếu có truyền mảng quyền mới, đưa vào object cập nhật
    if (permissions && Array.isArray(permissions)) {
      updateData.permissions = permissions;
    }

    // 4. Gọi Repo để ghi đè dữ liệu mới xuống DB
    return await groupRepository.update(groupId, updateData);
  }
  //   BKAV HaiHS : xử lý cập nhật nhóm - end

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
