import {
  // Day,
  Post,
  Like,
  Booked,
  Center,
  Comment,
  Teacher,
  Student,
  Follower,
  TeacherDay,
  Lesson,
  // ClassRoom,
  User,
  RefreshToken,
  ProfileTeacher,
  ProfileCenter,
  Weekly_schedule,
} from "../models/index.js";
import { CENTER, STUDENT, TEACHER } from "./constant.js";

// const UserModel = User;
// const CenterModel = Center;
// const TeacherModel = Teacher;
// const ProfileCenterModel = ProfileCenter;
// const ProfileTeacherModel = ProfileTeacher;
// const RefreshTokenModel = RefreshToken;
// const StudentModel = Student;
// const FollowerModel = Follower;
// const TeacherDayModel = TeacherDay;
// const ClassRoomModel = ClassRoom;
// const CommentModel = Comment;
// const LessonModel = Lesson;
// const BookedModel = Booked;
// const PostModel = Post;
// const LikeModel = Like;
// const DayModel = Day;

const cleanObject = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  );

const profileData = (role, req) => {
  let {
    bio,
    name,
    email,
    phone,
    address,
    password,
    imageUrl,
    whatsApp,
    classRoom,
    sharePrice,
    governorate,
    studySystem,
    studyMaterial,
    experienceYear,
    contactUsPhone,
    contactUsEmail,
    educationalStage,
    educationalQualification,
  } = cleanObject(req);

  const userData = {
    name,
    imageUrl,
    email,
    password,
    role,
    phone,
    address,
  };

  let teacherOrCenterOrStudentData = {};
  let profileDataObj = {};

  if (role === TEACHER) {
    teacherOrCenterOrStudentData = {
      classRoom,
      studySystem,
      studyMaterial,
    };

    profileDataObj = {
      bio,
      whatsApp,
      sharePrice,
      experienceYear,
      educationalQualification,
    };
  } else if (role === STUDENT) {
    teacherOrCenterOrStudentData = {
      classRoom,
      educationalStage,
    };
  } else if (role === CENTER) {
    teacherOrCenterOrStudentData = {
      studySystem,
      governorate,
      educationalStage,
    };
    profileDataObj = {
      bio,
      whatsApp,
      studyMaterial,
      contactUsPhone,
      contactUsEmail,
    };
  }

  return [userData, profileDataObj, teacherOrCenterOrStudentData];
};

const getModelByRoleAndType = (type) => {
  const map = {
    post: Post,
    like: Like,
    booked: Booked,
    comment: Comment,
    follow: Follower,
    teacherDay: TeacherDay,
    weekly_schedule: Weekly_schedule,
  };
  // };
  return map[type];
};

const getProfileModel = (role) => {
  if (role === "user") return User;
  if (role === "center") return Center;
  if (role === "teacher") return Teacher;
  if (role === "student") return Student;
  if (role === "refreshToken") return RefreshToken;
  if (role === "profile_center") return ProfileCenter;
  if (role === "profile_teacher") return ProfileTeacher;
  return null;
};

const getteacherModel = (role) => {
  if (role === "lesson") return Lesson;
  // if (role === "exam") return Teachers;
  // if (role === "assignment") return Students;
  // if (role === "memoirs") return Students;
  return null;
};

const excludePassword = ["createdAt", "updatedAt"];
const exclude = ["password", ...excludePassword];

const bulkCreate = (MODEL_NAME, data = [], options = {}) =>
  MODEL_NAME.bulkCreate(data, options);

const findOrCreate = (MODEL_NAME, options) => MODEL_NAME.findOrCreate(options);

const findOne = (MODEL_NAME, options) => MODEL_NAME.findOne(options);

const findByPk = (MODEL_NAME, id, options = {}) =>
  MODEL_NAME.findByPk(id, options);

const findAll = (MODEL_NAME, options = {}) => MODEL_NAME.findAll(options);

const create = (MODEL_NAME, user_obj, options = {}) =>
  MODEL_NAME.create(user_obj, options);

const update = (MODEL_NAME, id, user_obj, options = {}) =>
  MODEL_NAME.update(user_obj, {
    where: { id },
    ...options,
  });

const destroy = (MODEL_NAME, where, options = {}) =>
  MODEL_NAME.destroy({ where, ...options });

export {
  // DayModel,
  // UserModel,
  // PostModel,
  // LikeModel,
  // BookedModel,
  // CenterModel,
  // LessonModel,
  // CommentModel,
  // TeacherModel,
  // StudentModel,
  // FollowerModel,
  // ClassRoomModel,
  // TeacherDayModel,
  // RefreshTokenModel,
  // ProfileCenterModel,
  // ProfileTeacherModel,
  update,
  create,
  findOne,
  findAll,
  destroy,
  findByPk,
  exclude,
  bulkCreate,
  profileData,
  findOrCreate,
  excludePassword,
  getProfileModel,
  getteacherModel,
  getModelByRoleAndType,
};
