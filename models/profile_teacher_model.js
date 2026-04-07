import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user_model.js";

const ProfileTeacher = sequelize.define(
  "profile_teacher",
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
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    whatsApp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sharePrice: {
      type: DataTypes.INTEGER,
      min: [0, "can't be less than 0"],
      defaultValue: 0,
    },
    centersWhereHeStudie: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    educationalQualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experienceYear: {
      type: DataTypes.INTEGER,
      min: [0, "can't be less than 0"],
      max: [50, "can't be more than 50"],
      defaultValue: 0,
    },
    star: {
      type: DataTypes.FLOAT,
      min: [0, "can't be less than 0"],
      max: [5, "can't be more than 5"],
      defaultValue: 0,
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

export default ProfileTeacher;
