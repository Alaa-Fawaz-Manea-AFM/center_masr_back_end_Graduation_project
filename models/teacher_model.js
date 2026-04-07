import { User } from "./index.js";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Teacher = sequelize.define(
  "teacher",
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
    classRoom: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    studyMaterial: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    studySystem: {
      type: DataTypes.ARRAY(DataTypes.STRING()),
      defaultValue: ["arabic"],
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["classRoom", "studyMaterial"],
      },
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  },
);

export default Teacher;
