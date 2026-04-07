import sequelize from "../config/database.js";
import {
  create,
  findOne,
  exclude,
  findAll,
  findByPk,
  catchAsync,
  IfAppError,
  sendResponsive,
  getProfileModel,
  getteacherModel,
  checkOwnership,
} from "../utils/index.js";

const LessonModel = getteacherModel("lesson");

// ============= GET SINGLE LESSON =============
const getLesson = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;

  const lesson = await findByPk(LessonModel, id, {
    include: [
      {
        model: getProfileModel("teacher"),
        include: [
          {
            model: getProfileModel("user"),
            attributes: ["id", "name", "imageUrl"],
          },
        ],
        attributes: ["id"],
      },
    ],
    attributes: {
      exclude,
    },
  });
  IfAppError(!lesson, "Lesson not found", 404);

  sendResponsive(res, 200, lesson, "Lesson retrieved successfully");
});

// ============= GET ALL LESSONS =============
const getAllLessons = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.validatedData.query;
  const { studyMaterial, classRoom, teacherId } = req.validatedData.body;
  const offset = (page - 1) * limit;

  const filters = {};
  if (studyMaterial) filters.studyMaterial = studyMaterial;
  if (classRoom) filters.classRoom = classRoom;

  const lessons = await findAll(LessonModel, {
    where: { teacherId, ...filters },
    limit,
    offset,
    attributes: { exclude },
    order: [["createdAt", "DESC"]],
  });

  sendResponsive(res, 200, lessons, "Lessons retrieved successfully");
});

// ============= CREATE LESSON =============
const createLesson = catchAsync(async (req, res) => {
  const profileId = req.profileId;
  const data = { ...req.validatedData.body, teacherId: profileId };

  const transaction = await sequelize.transaction();
  try {
    const created = await create(LessonModel, data, { transaction });
    IfAppError(!created, "Error creating lesson", 400);

    await transaction.commit();
    sendResponsive(res, 201, created, "Lesson created successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error creating lesson", 500);
  }
});

// ============= UPDATE LESSON =============
const updateLesson = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const lessonData = req.validatedData.body;
  const profileId = req.profileId;

  const transaction = await sequelize.transaction();
  try {
    const lesson = await findOne(
      LessonModel,
      {
        where: { id, teacherId: profileId },
      },
      {
        attributes: { exclude },
      },
    );

    IfAppError(!lesson, "Error updating lesson", 404);
    await lesson.update(lessonData, {
      transaction,
    });

    await transaction.commit();
    sendResponsive(res, 200, lesson, "Lesson updated successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error updating lesson", 500);
  }
});

// ============= DELETE LESSON =============
const deleteLesson = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const profileId = req.profileId;

  const transaction = await sequelize.transaction();
  try {
    const lesson = await findOne(LessonModel, {
      where: { id, teacherId: profileId },
    });
    IfAppError(!lesson, "Error deleting lesson", 404);

    await destroy(LessonModel, {
      where: { id, teacherId: profileId },
      transaction,
    });
    await transaction.commit();
    sendResponsive(res, 200, null, "Lesson deleted successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error deleting lesson", 500);
  }
});

export { getLesson, getAllLessons, createLesson, updateLesson, deleteLesson };
