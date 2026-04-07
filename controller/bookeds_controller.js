import sequelize from "../config/database.js";
import {
  findOne,
  catchAsync,
  IfAppError,
  findOrCreate,
  sendResponsive,
  getModelByRoleAndType,
} from "../utils/index.js";

const BookedModel = getModelByRoleAndType("booked");
const TeacherDayModel = getModelByRoleAndType("teacherDay");

const toggleBookedStudent = catchAsync(async (req, res) => {
  const { id: teacherDayId } = req.validatedData.params;
  const studentId = req.profileId;

  const transaction = await sequelize.transaction();
  try {
    const teacherDay = await findOne(TeacherDayModel, {
      where: { id: teacherDayId },
      attributes: ["id"],
      transaction,
    });

    IfAppError(!teacherDay, "Teacher day not found", 404);

    const [booked, created] = await findOrCreate(BookedModel, {
      where: {
        studentId,
        teacherDayId,
      },
      transaction,
    });

    IfAppError(!created && !booked, "Error processing booking", 400);

    let message = "Booked";
    if (!created) {
      await booked.destroy({ transaction });

      message = "Unbooked";
    }

    await transaction.commit();

    sendResponsive(res, 201, null, `Weekly ${message} successfully`);
  } catch (error) {
    await transaction.rollback();
    if (error.isOperational) throw error;
    IfAppError(true, "Error processing booking", 500);
  }
});

export { toggleBookedStudent };
