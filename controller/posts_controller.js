import { Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import {
  CENTER,
  create,
  findOne,
  exclude,
  TEACHER,
  findAll,
  findByPk,
  catchAsync,
  IfAppError,
  sendResponsive,
  getProfileModel,
  getModelByRoleAndType,
} from "../utils/index.js";

const PostModel = getModelByRoleAndType("post");
const UserModel = getProfileModel("user");

// ============= GET SINGLE POST =============
const getPost = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const userId = req.userId;

  const safeUserId = userId ? sequelize.escape(userId) : null;

  const includeAttributes = [
    {
      model: UserModel,
      as: "user",
      attributes: [
        "id",
        "name",
        "imageUrl",
        [Sequelize.literal("false"), "isFollowed"],
      ],
    },
  ];

  const postAttributes = {
    exclude: [...exclude, "userId", "role"],
    include: [[Sequelize.literal("false"), "isLiked"]],
  };

  if (safeUserId) {
    postAttributes.include.push([
      Sequelize.literal(
        `EXISTS (SELECT 1 FROM "likes" l WHERE l."postId" = "post"."id" AND l."userId" = ${safeUserId})`,
      ),
      "isLiked",
    ]);

    includeAttributes[0].attributes.push([
      Sequelize.literal(
        `EXISTS (SELECT 1 FROM "followers" WHERE "followers"."followingId" = ${safeUserId} AND "followers"."followerId" = "post"."userId")`,
      ),
      "isFollowed",
    ]);
  }

  const post = await findByPk(PostModel, id, {
    include: includeAttributes,
    attributes: postAttributes,
  });
  IfAppError(!post, `Post not found`, 404);

  sendResponsive(res, 200, post, `Post retrieved successfully`);
});

// ============= GET ALL POSTS =============
const getAllPosts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.validatedData.query;
  const { role, userId } = req.validatedData.body;
  const cuurrentUserId = req.userId;

  const safeUserId = cuurrentUserId ? sequelize.escape(cuurrentUserId) : null;
  const checkRolel = [TEACHER, CENTER].includes(role);
  IfAppError(!checkRolel, "Invalid role", 400);

  const includeAttributes = [
    {
      model: UserModel,
      as: "user",
      attributes: ["id", "name", "imageUrl"],
    },
  ];

  const postAttributes = {
    exclude: [...exclude, "userId", "role"],
    include: [[Sequelize.literal("false"), "isLiked"]],
  };

  if (safeUserId) {
    postAttributes.include.push([
      Sequelize.literal(
        `EXISTS (SELECT 1 FROM "likes" l WHERE l."postId" = "post"."id" AND l."userId" = ${safeUserId})`,
      ),
      "isLiked",
    ]);
  }

  const options = {
    where: { userId, role },
    limit,
    offset: (page - 1) * limit,
    order: [["createdAt", "DESC"]],
    include: includeAttributes,
    attributes: postAttributes,
  };

  const posts = await findAll(PostModel, options);
  sendResponsive(
    res,
    200,
    posts,
    `Posts for role ${role} retrieved successfully`,
  );
});

// ============= CREATE POST =============
const createPost = catchAsync(async (req, res) => {
  const role = req.role;
  const userId = req.userId;
  const postData = { ...req.validatedData.body, userId, role };

  const transaction = await sequelize.transaction();
  try {
    const newPost = await create(PostModel, postData, {
      transaction,
    });
    IfAppError(!newPost, "Error creating post", 500);
    const user = await findByPk(UserModel, userId);
    IfAppError(!user, "User not found", 404);

    await user.increment({ postCounts: 1 }, { transaction });
    await transaction.commit();
    sendResponsive(res, 201, newPost, `Post created successfully`);
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error processing post", 500);
  }
});

// ============= UPDATE POST =============
const updatePost = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const postData = req.validatedData.body;
  const userId = req.userId;

  const transaction = await sequelize.transaction();
  try {
    const post = await findOne(
      PostModel,
      {
        where: { id, userId },
      },
      {
        attributes: ["id", "title", "content"],
      },
    );

    IfAppError(!post, "Error updating post", 404);
    await post.update(postData, {
      transaction,
    });
    await transaction.commit();
    sendResponsive(res, 200, null, "Post updated successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error updating post", 500);
  }
});

// ============= DELETE POST =============
const deletePost = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const userId = req.userId;

  const transaction = await sequelize.transaction();
  try {
    const post = await findOne(PostModel, {
      where: { id, userId },
    });
    IfAppError(!post, `Error deleting post`, 404);

    await post.destroy({
      transaction,
    });
    await UserModel.decrement(
      { postCounts: 1 },
      { where: { id: userId }, transaction },
    );

    await transaction.commit();
    sendResponsive(res, 200, null, `Post deleted successfully`);
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error deleting post", 500);
  }
});

export { getPost, getAllPosts, createPost, updatePost, deletePost };
