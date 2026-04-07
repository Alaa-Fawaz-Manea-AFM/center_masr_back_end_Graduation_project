import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user_model.js";

const ProfileCenter = sequelize.define(
  "profile_center",
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
    contactUsPhone: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    studyMaterial: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    contactUsEmail: {
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

export default ProfileCenter;
