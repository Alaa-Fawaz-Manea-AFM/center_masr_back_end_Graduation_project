import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Student from "./student_model.js";
import TeacherDay from "./teacher_Day_model.js";

const Booked = sequelize.define(
  "booked",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Student, key: "id" },
      onDelete: "CASCADE",
    },
    teacherDayId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: TeacherDay, key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    // timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["studentId", "teacherDayId"],
      },
    ],
  },
);

export default Booked;
