import Like from "./like_model.js";
import Post from "./post_model.js";
import User from "./user_model.js";
import Center from "./center_model.js";
import Weekly_schedule from "./weekly_schedule_model.js";
import Student from "./student_model.js";
import Teacher from "./teacher_model.js";
import Comment from "./comment_model.js";
import Follower from "./follower_model.js";
import Booked from "./booked_teacher_center_model.js";
import Lesson from "./lesson_model.js";
import TeacherDay from "./teacher_Day_model.js";
import RefreshToken from "./refreshToken_model.js";
import ProfileCenter from "./profile_center_model.js";
import ProfileTeacher from "./profile_teacher_model.js";

// All Relations (1-to-1)
// User ↔ Centers
User.hasOne(Center, {
  foreignKey: "userId",
  as: "user_center",
  onDelete: "CASCADE",
});
User.hasOne(Teacher, {
  foreignKey: "userId",
  as: "user_teacher",
  onDelete: "CASCADE",
});
User.hasOne(Student, {
  foreignKey: "userId",
  as: "user_student",
  onDelete: "CASCADE",
});
User.hasOne(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokenData",
  onDelete: "CASCADE",
});
User.hasOne(ProfileCenter, {
  foreignKey: "userId",
  as: "profile_center",
  onDelete: "CASCADE",
});
User.hasOne(ProfileTeacher, {
  foreignKey: "userId",
  as: "profile_teacher",
  onDelete: "CASCADE",
});

Center.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Teacher.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Student.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
ProfileCenter.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
ProfileTeacher.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, {
  foreignKey: "userId",
});
// End All Relations (1-to-1)

// All Relations (1-to-many)
// User ↔ Posts
User.hasMany(Post, { foreignKey: "userId", as: "posts", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

// User ↔ Comments
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Posts ↔ Comments
Post.hasMany(Comment, {
  foreignKey: "postId",
  as: "comments",
  onDelete: "CASCADE",
});
Comment.belongsTo(Post, { foreignKey: "postId" });

// Posts ↔ Likes
Teacher.hasMany(Lesson, {
  foreignKey: "teacherId",
  onDelete: "CASCADE",
});
Lesson.belongsTo(Teacher, {
  foreignKey: "teacherId",
});

// Days ↔ TeacherDays
Weekly_schedule.hasMany(TeacherDay, {
  foreignKey: "Weekly_scheduleId",
  as: "teacherDays",
  onDelete: "CASCADE",
});

TeacherDay.belongsTo(Weekly_schedule, {
  foreignKey: "Weekly_scheduleId",
  as: "centerDay",
});

// Teacher ↔ TeacherDays
Teacher.hasMany(TeacherDay, {
  foreignKey: "teacherId",
  as: "teacherDays",
  onDelete: "CASCADE",
});
TeacherDay.belongsTo(Teacher, { foreignKey: "teacherId", as: "teacher" });

// End All Relations (many-to-many)
//  Students ↔ TeacherDays
Student.belongsToMany(TeacherDay, {
  through: Booked,
  as: "bookeds",
  foreignKey: "studentId",
  otherKey: "teacherDayId",
});
TeacherDay.belongsToMany(Student, {
  through: Booked,
  as: "bookeds",
  foreignKey: "teacherDayId",
  otherKey: "studentId",
});

// User ↔ Likes
User.belongsToMany(Post, {
  through: Like,
  as: "likes",
  foreignKey: "userId",
  otherKey: "postId",
});
Post.belongsToMany(User, {
  through: Like,
  as: "likes",
  foreignKey: "postId",
  otherKey: "userId",
});

// User ↔ Follower
User.belongsToMany(User, {
  through: Follower,
  as: "followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});

User.belongsToMany(User, {
  through: Follower,
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId",
});

// End All Relations (many-to-many)

export {
  User,
  Post,
  Like,
  Center,
  Booked,
  Comment,
  Student,
  Lesson,
  Teacher,
  Follower,
  TeacherDay,
  RefreshToken,
  ProfileCenter,
  ProfileTeacher,
  Weekly_schedule,
};
