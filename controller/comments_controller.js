import sequelize from "../config/database.js";
import {
  create,
  findAll,
  findOne,
  findByPk,
  catchAsync,
  IfAppError,
  sendResponsive,
  getProfileModel,
  getModelByRoleAndType,
} from "../utils/index.js";

const CommentModel = getModelByRoleAndType("comment");
const PostModel = getModelByRoleAndType("post");
const UserModel = getProfileModel("user");

const commentIncludeOptions = {
  attributes: ["id", "content", "createdAt"],
  include: [
    {
      model: UserModel,
      as: "user",
      attributes: ["id", "name", "imageUrl"],
    },
  ],
};

// ============= GET ALL COMMENTS =============
const getAllComments = catchAsync(async (req, res) => {
  const { limit = 10, page = 1 } = req.validatedData.query;
  const { id: postId } = req.validatedData.body;

  const offset = (page - 1) * limit;

  const options = {
    limit,
    offset,
    where: { postId },
    ...commentIncludeOptions,
    order: [["createdAt", "DESC"]],
  };
  const comments = await findAll(CommentModel, options);

  sendResponsive(res, 200, comments, `Comments retrieved successfully`);
});

// ============= CREATE COMMENT =============
const createComment = catchAsync(async (req, res) => {
  const { postId, content } = req.validatedData.body;
  const userId = req.userId;

  const transaction = await sequelize.transaction();
  try {
    const post = await findByPk(PostModel, postId, {
      attributes: ["id"],
    });
    IfAppError(!post, "Post not found", 404);

    const comment = await create(
      CommentModel,
      {
        userId,
        postId,
        content,
      },
      { transaction },
    );

    IfAppError(!comment, "Error creating comment", 400);

    await post.increment({ commentCounts: 1 }, { transaction });
    await transaction.commit();
    sendResponsive(res, 201, null, "Comment created successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error creating comment", 500);
  }
});

// ============= UPDATE COMMENT =============
const updateComment = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const { content } = req.validatedData.body;
  const userId = req.userId;

  const transaction = await sequelize.transaction();
  try {
    const comment = await findOne(CommentModel, {
      where: { id, userId },
    });

    IfAppError(!comment, `Error updating comment`, 404);

    await comment.update(
      { content },
      {
        transaction,
      },
    );

    await transaction.commit();
    sendResponsive(res, 200, null, `Comment updated successfully`);
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error updating comment", 500);
  }
});

// ============= DELETE COMMENT =============
const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const userId = req.userId;

  const transaction = await sequelize.transaction();
  try {
    const comment = await findOne(CommentModel, { where: { id, userId } });

    IfAppError(!comment, "Error deleting comment", 404);

    await comment.destroy({ transaction });
    await PostModel.decrement(
      { commentCounts: 1 },
      { where: { id: comment.postId }, transaction },
    );

    await transaction.commit();
    sendResponsive(res, 200, null, "Comment deleted successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error deleting comment", 500);
  }
});

export { getAllComments, createComment, updateComment, deleteComment };
