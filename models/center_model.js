import { User } from "./index.js";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Center = sequelize.define(
  "center",
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
    governorate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    educationalStage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
        fields: ["governorate", "educationalStage"],
      },
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  },
);

export default Center;
