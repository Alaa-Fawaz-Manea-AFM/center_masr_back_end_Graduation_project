import { Teacher } from "./index.js";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Lesson = sequelize.define(
  "lesson",
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studyMaterial: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classRoom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vedioUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: [true, "VedioUrl must be a valid URL"],
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["teacherId"],
      },
    ],
  },
);

export default Lesson;
