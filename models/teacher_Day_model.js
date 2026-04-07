import { DataTypes } from "sequelize";
import { Teacher, Weekly_schedule } from "./index.js";
import sequelize from "../config/database.js";

const TeacherDay = sequelize.define(
  "teacherDay",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Teacher, key: "id" },
      onDelete: "CASCADE",
    },
    Weekly_scheduleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Weekly_schedule, key: "id" },
      onDelete: "CASCADE",
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    studyMaterial: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["teacherId", "Weekly_scheduleId", "day", "time"],
      },
    ],
  },
);

export default TeacherDay;
