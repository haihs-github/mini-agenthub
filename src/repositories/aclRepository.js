const prisma = require("../models/prismaClient");

class ACLRepository {
  // BKAV HaiHS :Hàm check xem User (hoặc các Group của User) có dòng ACL nào khớp không
  async hasAccess({ userId, groupIds, resourceType, resourceId, action }) {
    const aclCount = await prisma.aCL.count({
      where: {
        resourceType: resourceType,
        resourceId: parseInt(resourceId),
        action: action,
        OR: [
          // Trường hợp 1: Được đích danh User này
          { userId: parseInt(userId) },
          // Trường hợp 2: Hoặc User nằm trong những Group được cấp quyền này
          { groupId: { in: groupIds.map((id) => parseInt(id)) } },
        ],
      },
    });

    return aclCount > 0; // Trả về true nếu tìm thấy ít nhất 1 dòng ACL hợp lệ
  }
  // BKAV HaiHS :Hàm check xem User (hoặc các Group của User) có dòng ACL nào khớp không

  // Hàm hỗ trợ: Admin cấp quyền ACL mới cho một ai đó hoặc một nhóm nào đó trên một đối tượng
  async createACL(data) {
    return await prisma.aCL.create({ data });
  }
}

module.exports = new ACLRepository();
