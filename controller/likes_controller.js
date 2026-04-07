import sequelize from "../config/database.js";
import {
  findByPk,
  catchAsync,
  IfAppError,
  findOrCreate,
  sendResponsive,
  getModelByRoleAndType,
} from "../utils/index.js";

const LikeModel = getModelByRoleAndType("like");
const PostModel = getModelByRoleAndType("post");

const toggleLike = catchAsync(async (req, res) => {
  const { id: postId } = req.validatedData.params;
  const userId = req.userId;

  const transaction = await sequelize.transaction();
  try {
    const post = await findByPk(PostModel, postId, {
      attributes: ["id", "likeCounts"],
    });
    IfAppError(!post, "Post not found", 400);
    const [like, created] = await findOrCreate(LikeModel, {
      where: {
        userId,
        postId,
      },
      transaction,
    });

    IfAppError(!like && !created, "Error processing like", 500);

    let message = "liked";
    if (created && like) {
      await post.increment({ likeCounts: 1 }, { transaction });
    } else if (!created && like) {
      await like.destroy({ transaction });
      await post.decrement({ likeCounts: 1 }, { transaction });
      message = "unliked";
    }

    await transaction.commit();
    sendResponsive(res, 201, null, `Post ${message} successfully`);
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error processing like", 500);
  }
});

export default toggleLike;
