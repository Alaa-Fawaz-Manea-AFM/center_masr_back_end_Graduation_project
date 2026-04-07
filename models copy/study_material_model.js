import { User } from "./index.js";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StudyMaterial = sequelize.define(
  "study_material",
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
    studyMaterial: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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

export default StudyMaterial;
