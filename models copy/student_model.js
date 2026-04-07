import { User } from "./index.js";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Student = sequelize.define(
  "student",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    educationalStage: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    classRoom: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  },
);

export default Student;
