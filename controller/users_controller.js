import { Op, Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import {
  CENTER,
  TEACHER,
  exclude,
  findAll,
  findByPk,
  catchAsync,
  IfAppError,
  profileData,
  cookieOptions,
  sendResponsive,
  getProfileModel,
  refreshCookieOptions,
} from "../utils/index.js";

const UserModel = getProfileModel("user");
const validRole = [TEACHER, CENTER];
// ============= GET SINGLE USER =============
const getUser = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const { role } = req.validatedData.body;
  const currentUserId = req.userId;

  const safeUserId = currentUserId ? sequelize.escape(currentUserId) : null;
  const checkRolel = validRole.includes(role);
  IfAppError(!checkRolel, "invalid Role, must by teacher, center");

  const attributes = {
    exclude: [...exclude, "userId", "email", "updatedAt"],
    include: [],
  };

  const userRoles = `user_${role}`;
  const profileRoles = `profile_${role}`;
  const include = validRole ? [userRoles, profileRoles] : [userRoles];

  if (checkRolel && safeUserId) {
    attributes.include.push([
      Sequelize.literal(
        `EXISTS (
          SELECT 1 FROM "followers"
          WHERE "followers"."followingId" = ${safeUserId}
          AND "followers"."followerId" = "user"."id"
        )`,
      ),
      "isFollowed",
    ]);
  }
  let options = {
    include,
    attributes,
  };

  const user = await findByPk(UserModel, id, options);
  IfAppError(!user, "User not found", 404);

  sendResponsive(res, 200, user, "User retrieved successfully");
});

const getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 6 } = req.validatedData.query;
  const {
    role,
    name,
    classRoom,
    governorate,
    studyMaterial,
    educationalStage,
  } = req.validatedData.body;

  IfAppError(
    !validRole.includes(role),
    "Invalid role must be (teacher or center)",
    400,
  );

  const offset = (page - 1) * limit;
  const userFilters = [];
  let profileFilters = [];

  // ======== CENTER ========
  if (educationalStage) {
    profileFilters.push({
      educationalStage: { [Op.contains]: [educationalStage] },
    });
  }
  if (governorate) {
    profileFilters.push({
      governorate: { [Op.iLike]: `%${governorate}%` },
    });
  }
  // ======== TEACHER ========
  if (classRoom) {
    profileFilters.push({
      classRoom: { [Op.iLike]: `%${classRoom}%` },
    });
  }
  if (studyMaterial) {
    profileFilters.push({
      studyMaterial: { [Op.iLike]: `%${studyMaterial}%` },
    });
  }

  if (name) {
    userFilters.push({
      name: { [Op.iLike]: `%${name}%` },
    });
    profileFilters = [];
  }

  const options = {
    where: profileFilters.length > 0 ? { [Op.and]: profileFilters } : {},
    limit,
    offset,
    order: [["createdAt", "ASC"]],
    attributes: { exclude: [...exclude, "userId"] },
    include: [
      {
        where: userFilters.length > 0 ? { [Op.and]: userFilters } : undefined,
        model: UserModel,
        attributes: ["name", "id", "imageUrl"],
        required: userFilters.length > 0,
      },
    ],
  };

  const users = await findAll(getProfileModel(role), options);

  sendResponsive(res, 200, users, "User retrieved successfully");
});

// ============= UPDATE USER =============
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const { role: _role, ...data } = req.validatedData.body;
  const role = req.role;

  IfAppError(role !== _role, "You can't update user role", 400);

  const [userData, profileDataObj, teacherData] = profileData(role, data);

  const userRoles = `user_${role}`;
  const profileRoles = `profile_${role}`;

  const include = validRole.includes(role)
    ? [userRoles, profileRoles]
    : [userRoles];

  const options = {
    include,
  };

  const transaction = await sequelize.transaction();

  try {
    const user = await findByPk(UserModel, id, options);
    IfAppError(!user, "User not found", 404);

    //  1. update user
    if (Object.keys(userData).length) {
      await user.update(userData, { transaction });
    }

    //  2. update role model (teacher / center / student)
    if (Object.keys(teacherData).length && user[userRoles]) {
      await user[userRoles].update(teacherData, {
        transaction,
      });
    }

    //  3. update profile
    if (
      Object.keys(profileDataObj).length &&
      validRole.includes(role) &&
      user[profileRoles]
    ) {
      await user[profileRoles].update(profileDataObj, {
        transaction,
      });
    }

    await transaction.commit();

    sendResponsive(res, 200, user, "User updated successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Failed to update user", 500);
  }
});

// ============= DELETE USER =============
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;

  const transaction = await sequelize.transaction();
  try {
    const user = await findByPk(UserModel, id);
    IfAppError(!user, "Failed to delete user", 404);

    await user.destroy({ transaction });

    await transaction.commit();
    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions);
    sendResponsive(res, 200, null, "User deleted successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Failed to delete user", 500);
  }
});

export { getAllUsers, getUser, updateUser, deleteUser };
