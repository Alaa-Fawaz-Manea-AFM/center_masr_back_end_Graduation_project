import { Center } from "./index.js";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Weekly_schedule = sequelize.define(
  "weekly_schedule",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    centerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Center, key: "id" },
      onDelete: "CASCADE",
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
        fields: ["centerId", "classRoom"],
      },
    ],
  },
);

export default Weekly_schedule;
