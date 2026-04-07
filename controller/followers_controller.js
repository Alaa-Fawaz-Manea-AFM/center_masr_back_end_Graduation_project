import sequelize from "../config/database.js";
import {
  CENTER,
  TEACHER,
  findByPk,
  catchAsync,
  IfAppError,
  findOrCreate,
  sendResponsive,
  getProfileModel,
  getModelByRoleAndType,
} from "../utils/index.js";

const FollowModel = getModelByRoleAndType("follow");
const UserModel = getProfileModel("user");

// ============= TOGGLE FOLLOW =============
const toggleFollowUser = catchAsync(async (req, res) => {
  const { id: targetUserId } = req.validatedData.params;
  const userId = req.userId;

  const transaction = await sequelize.transaction();
  try {
    const targetUserFollowing = await findByPk(UserModel, targetUserId, {
      attributes: ["id", "role"],
    });
    const currentUserFollower = await findByPk(UserModel, userId, {
      attributes: ["id"],
    });

    IfAppError(!currentUserFollower, "User follower not found", 404);
    IfAppError(!targetUserFollowing, "User following not found", 404);

    IfAppError(
      ![TEACHER, CENTER].includes(targetUserFollowing?.role),
      "Invalid role must be (teacher or center)",
      400,
    );

    const [follow, created] = await findOrCreate(FollowModel, {
      where: {
        followingId: userId,
        followerId: targetUserId,
      },
      transaction,
    });

    IfAppError(!follow && !created, "Error processing follow", 500);

    let message = "followed";
    if (created && follow) {
      await targetUserFollowing.increment(
        { followerCounts: 1 },
        { transaction },
      );
      await currentUserFollower.increment(
        { followingCounts: 1 },
        { transaction },
      );
    } else if (!created && follow) {
      await follow.destroy({ transaction });
      await targetUserFollowing.decrement(
        { followerCounts: 1 },
        { transaction },
      );
      await currentUserFollower.decrement(
        { followingCounts: 1 },
        { transaction },
      );
      message = "unfollowed";
    }

    await transaction.commit();
    sendResponsive(res, 201, null, `User ${message} successfully`);
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error processing follow", 500);
  }
});

export default toggleFollowUser;
