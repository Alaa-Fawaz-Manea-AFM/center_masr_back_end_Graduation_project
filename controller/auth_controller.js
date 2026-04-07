import sequelize from "../config/database.js";
import {
  refreshCookieOptions,
  cookieOptions,
  CENTER,
  TEACHER,
} from "../utils/index.js";
import {
  create,
  findOne,
  JwtSign,
  destroy,
  JwtVerify,
  IfAppError,
  catchAsync,
  profileData,
  findOrCreate,
  sendResponsive,
  checkOwnership,
  getProfileModel,
} from "../utils/index.js";
const ProfileModel = (role) => getProfileModel(role);

const signUp = catchAsync(async (req, res) => {
  const data = req.validatedData.body;
  const { role, email } = data;

  let [userData, profileDataObj, teacherOrCenterOrStudentData] = profileData(
    role,
    data,
  );

  const transaction = await sequelize.transaction();
  try {
    const [newUser, created] = await findOrCreate(ProfileModel("user"), {
      where: { email },
      defaults: userData,
      transaction,
    });

    IfAppError(!newUser, "User registration failed", 400);
    IfAppError(!created, "Email already exists", 400);

    const userId = newUser.id;
    let userProfile = {};
    if ([TEACHER, CENTER].includes(role)) {
      userProfile = await create(
        ProfileModel(`profile_${role}`),
        { ...profileDataObj, userId },
        {
          transaction,
        },
      );
    }

    const userTeacherOrCenterOrStudent = await create(
      ProfileModel(role),
      { ...teacherOrCenterOrStudentData, userId },
      {
        transaction,
      },
    );

    IfAppError(
      !userTeacherOrCenterOrStudent || !userProfile,
      "User profile creation failed",
      400,
    );

    const token = JwtSign(userId, userTeacherOrCenterOrStudent.id, role);
    const refresh_token = JwtSign(
      userId,
      userTeacherOrCenterOrStudent.id,
      role,
      "refresh",
    );

    const [newRefreshToken, createdRefreshToken] = await findOrCreate(
      ProfileModel("refreshToken"),
      {
        where: { userId },
        defaults: { userId, refresh_token },
        transaction,
      },
    );

    IfAppError(
      !newRefreshToken || !createdRefreshToken,
      "User registration failed",
      400,
    );

    if (newRefreshToken || !createdRefreshToken) {
      newRefreshToken.refresh_token = refresh_token;
      await newRefreshToken.save({ transaction });
    }

    res.cookie("accessToken", token, cookieOptions);
    res.cookie("refreshToken", refresh_token, refreshCookieOptions);

    newUser.password = undefined;
    let dataResponse = {};
    if ([TEACHER, CENTER].includes(role)) {
      dataResponse.user = {
        newUser,
        userTeacherOrCenterOrStudent,
        userProfile,
      };
    } else {
      dataResponse.user = {
        newUser,
        userTeacherOrCenterOrStudent,
      };
    }

    await transaction.commit();
    sendResponsive(
      res,
      201,
      dataResponse,
      "User registered successfully",
      token,
      refreshCookieOptions,
    );
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "User registration failed", 400);
  }
});

const logIn = catchAsync(async (req, res) => {
  const { email, password } = req.validatedData.body;

  const transaction = await sequelize.transaction();
  try {
    const user = await findOne(ProfileModel("user"), {
      where: { email },
      attributes: ["id", "role", "password"],
      transaction,
    });
    IfAppError(!user, "Invalid credentials", 404);

    const isMatch = await ProfileModel("user").passwordMatches(
      password,
      user?.password,
    );

    IfAppError(!isMatch, "Invalid credentials", 404);

    let userProfile = {};
    if ([TEACHER, CENTER].includes(user.role)) {
      userProfile = await findOne(ProfileModel(`profile_${user.role}`), {
        where: { userId: user.id },
      });
    }

    const userTeacherOrCenterOrStudent = await findOne(
      ProfileModel(user.role),
      {
        where: { userId: user.id },
      },
    );
    IfAppError(
      !userTeacherOrCenterOrStudent || !userProfile,
      "Invalid credentials",
      404,
    );

    const token = JwtSign(user.id, userTeacherOrCenterOrStudent.id, user.role);
    const refresh_token = JwtSign(
      user.id,
      userTeacherOrCenterOrStudent.id,
      user.role,
      "refresh",
    );

    let tokenRecord = await findOne(ProfileModel("refreshToken"), {
      where: { userId: user.id },
    });

    if (tokenRecord) {
      tokenRecord.refresh_token = refresh_token;
      await tokenRecord.save({ transaction });
    } else {
      await create(
        ProfileModel("refreshToken"),
        {
          userId: user.id,
          refresh_token,
        },
        { transaction },
      );
    }

    res.cookie("accessToken", token, cookieOptions);
    res.cookie("refreshToken", refresh_token, refreshCookieOptions);

    user.password = undefined;
    const dataResponse = {};
    if ([CENTER, TEACHER].includes(user.role)) {
      dataResponse.user = {
        user,
        userTeacherOrCenterOrStudent,
        userProfile,
      };
    } else {
      dataResponse.user = {
        user,
        userTeacherOrCenterOrStudent,
      };
    }

    await transaction.commit();
    sendResponsive(
      res,
      200,
      dataResponse,
      "User logged in successfully",
      token,
    );
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "User login failed", 404);
  }
});

const logOut = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const currentUserId = req.userId;

  IfAppError(!refreshToken, "Refresh token not found", 401);
  const transaction = await sequelize.transaction();
  try {
    const { userId } = JwtVerify(refreshToken, "refresh");
    checkOwnership(currentUserId, userId);
    await destroy(
      ProfileModel("refreshToken"),
      { userId: currentUserId },
      { transaction },
    );

    await transaction.commit();
    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions);
    sendResponsive(res, 200, null, "User logged out successfully", null);
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "User logout failed", 500);
  }
});

const refreshTokenHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  IfAppError(!refreshToken, "Invalid or expired refresh token", 403);
  try {
    const decoded = JwtVerify(refreshToken, "refresh");
    IfAppError(!decoded, "Invalid or expired refresh token", 403);

    let tokenRecord = await findOne(ProfileModel("refreshToken"), {
      where: { userId: decoded.userId },
      attributes: ["refresh_token"],
    });
    IfAppError(!tokenRecord, "Invalid or expired refresh token", 403);

    const isValid = await ProfileModel("refreshToken").verifyTokenMatches(
      refreshToken,
      tokenRecord.refresh_token,
    );

    IfAppError(!isValid, "Invalid or expired refresh token", 403);

    const newAccessToken = JwtSign(
      decoded.userId,
      decoded.profileId,
      decoded.role,
    );

    tokenRecord = null;
    res.cookie("accessToken", newAccessToken, cookieOptions);
    sendResponsive(res, 200, null, "Access token refreshed");
  } catch (err) {
    if (err.isOperational) throw err;
    IfAppError(true, "Invalid or expired refresh token", 403);
  }
});

const getMy = catchAsync(async (req, res) => {
  const { userId, role } = req;

  const includeUser = [
    {
      model: ProfileModel(role),
      as: "user",
      attributes: {
        exclude: ["userId"],
      },
    },
  ];
  const includeUserAndProfile = [
    ...includeUser,
    {
      model: ProfileModel(`profile_${role}`),
      as: `profile_${role}`,
      attributes: {
        exclude: ["userId"],
      },
    },
  ];

  const include = [TEACHER, CENTER].includes(role)
    ? includeUserAndProfile
    : include;

  const user = await findOne(profileData("user"), {
    where: { id: userId },
    include,
    attributes: { exclude },
  });
  IfAppError(!user, "User not found, please sign up", 404);

  sendResponsive(res, 200, user, "User found successfully");
});

export { signUp, logIn, logOut, getMy, refreshTokenHandler };
