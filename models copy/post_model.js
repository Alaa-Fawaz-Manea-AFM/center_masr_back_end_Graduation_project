import User from "./user_model.js";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Post = sequelize.define(
  "post",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("center", "teacher"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    likeCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
      },
    ],
  },
);

export default Post;
