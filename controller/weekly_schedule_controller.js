import { Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import {
  findAll,
  STUDENT,
  weekDays,
  findByPk,
  IfAppError,
  bulkCreate,
  catchAsync,
  findOrCreate,
  checkOwnership,
  getProfileModel,
  excludePassword,
  sendResponsive,
  getModelByRoleAndType,
} from "../utils/index.js";

const DayModel = (type) => getModelByRoleAndType(type);
const TeacherModel = getProfileModel("teacher");
const CenterModel = getProfileModel("center");
const UserModel = getProfileModel("user");

const getWeeklySchedule = catchAsync(async (req, res) => {
  const { centerId, classRoom } = req.validatedData.body;
  const profileId = req.profileId;
  const role = req.role;

  const safeUserId = profileId ? sequelize.escape(profileId) : null;
  const center = await findByPk(CenterModel, centerId);
  IfAppError(!center, "center not found", 404);

  const includeAttributes = {
    exclude: excludePassword,
    include: [[Sequelize.literal("false"), "isBooked"]],
  };

  if (safeUserId && role === STUDENT) {
    includeAttributes.include.push([
      Sequelize.literal(
        ` EXISTS ( SELECT 1 FROM "bookeds" b WHERE b."teacherDayId" = "teacherDay"."id" AND b."studentId" = ${safeUserId})`,
      ),
      "isBooked",
    ]);
  }

  const options = {
    where: { centerId, classRoom },
    include: [
      {
        model: DayModel("teacherDay"),
        as: "teacherDays",
        attributes: includeAttributes,
        separate: true,
        order: [["time", "ASC"]],
        include: [
          {
            model: TeacherModel,
            as: "teacher",
            attributes: ["id", "userId"],
            include: [
              {
                model: UserModel,
                attributes: ["name", "imageUrl"],
              },
            ],
          },
        ],
      },
    ],
  };

  const days = await findAll(DayModel("weekly_schedule"), options);

  const schedule = {};
  weekDays?.forEach((d) => (schedule[d] = []));

  if (days) {
    days.forEach((day) => {
      day.teacherDays?.forEach((lesson) => {
        schedule[lesson.day].push({
          id: lesson.id,
          time: lesson.time,
          studyMaterial: lesson.studyMaterial,
          isBooked: lesson.dataValues.isBooked,
          teacher: lesson.teacher
            ? {
                id: lesson.teacher.id,
                userId: lesson.teacher.userId,
                name: lesson.teacher.user.name,
                imageUrl: lesson.teacher.user.imageUrl,
              }
            : null,
        });
      });
    });
  }

  sendResponsive(res, 200, schedule, "Day found successfully");
});

const createWeeklySchedule = catchAsync(async (req, res) => {
  const { classRoom, dataDays } = req.validatedData.body;
  const centerId = req.profileId;

  const transaction = await sequelize.transaction();
  try {
    const [weekDay, created] = await findOrCreate(DayModel("weekly_schedule"), {
      where: {
        classRoom,
        centerId,
      },

      transaction,
    });

    IfAppError(!weekDay, "weekly schedule not found", 400);
    IfAppError(!created, "Weekly schedule already exists", 400);

    const Weekly_scheduleId = weekDay.id;

    const dataDay = dataDays.map((item) => ({
      ...item,
      Weekly_scheduleId,
    }));

    // check if teacherId is valid
    const teacherIds = [...new Set(dataDay.map((item) => item.teacherId))];

    const existingTeachers = await findAll(TeacherModel, {
      where: { id: teacherIds },
      attributes: ["id"],
      transaction,
    });

    const existingSet = new Set(existingTeachers.map((t) => t.id));
    const invalidIds = teacherIds.filter((id) => !existingSet.has(id));
    IfAppError(
      invalidIds.length > 0,
      `Invalid teacherId(s): ${invalidIds.join(", ")}`,
      400,
    );

    const teacherDays = await bulkCreate(DayModel("teacherDay"), dataDay, {
      transaction,
      fields: [
        "id",
        "time",
        "day",
        "studyMaterial",
        "Weekly_scheduleId",
        "teacherId",
      ],
    });

    IfAppError(!teacherDays, "weekly Day not found", 400);

    await transaction.commit();
    sendResponsive(
      res,
      200,
      { weekDay, teacherDays },
      "Weekly Schedule created successfully",
    );
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Failed to create weekly schedule", 500);
  }
});

const updateWeeklySchedule = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const dataWeeklyDay = req.validatedData.body;
  const profileId = req.profileId;

  const transaction = await sequelize.transaction();
  try {
    const teacherDays = await findByPk(DayModel("teacherDay"), id, {
      include: [
        {
          model: DayModel("weekly_schedule"),
          as: "centerDay",
          attributes: ["centerId"],
        },
      ],
    });

    IfAppError(!teacherDays, "teacher weekly schedule not found", 404);
    checkOwnership(teacherDays.centerDay.centerId, profileId);

    const existingTeacher = await findByPk(
      TeacherModel,
      dataWeeklyDay.teacherId,
      {
        attributes: ["id"],
        transaction,
      },
    );
    IfAppError(
      !existingTeacher,
      `Invalid teacherId(s): ${dataWeeklyDay.teacherId}`,
      400,
    );

    const updatedDay = await teacherDays.update(dataWeeklyDay, {
      transaction,
    });
    IfAppError(!updatedDay, "Weekly schedule not updated", 404);

    await transaction.commit();
    sendResponsive(
      res,
      200,
      updatedDay,
      `Weekly schedule updated successfully`,
    );
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error updating weekly schedule", 500);
  }
});

const deleteWeeklySchedule = catchAsync(async (req, res) => {
  const { id } = req.validatedData.params;
  const profileId = req.profileId;
  console.log(profileId);

  const transaction = await sequelize.transaction();
  try {
    console.log(0);
    const teacherDay = await findByPk(DayModel("teacherDay"), id, {
      include: [
        {
          model: DayModel("weekly_schedule"),
          as: "centerDay",
          attributes: ["centerId"],
        },
      ],
    });

    IfAppError(!teacherDay, "teacher weekly schedule not found", 404);
    checkOwnership(teacherDay.centerDay.dataValues.centerId, profileId);
    await teacherDay.destroy({ transaction });

    await transaction.commit();
    sendResponsive(res, 200, null, "Weekly schedule deleted successfully");
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(
      true,
      "Error deleting weekly schedule" + " " + error.message,
      500,
    );
  }
});

export {
  getWeeklySchedule,
  createWeeklySchedule,
  updateWeeklySchedule,
  deleteWeeklySchedule,
};
