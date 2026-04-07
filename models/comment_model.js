import { DataTypes } from "sequelize";
import { Post, User } from "./index.js";

import sequelize from "../config/database.js";

const Comment = sequelize.define(
  "comment",
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
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Post, key: "id" },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["userId", "postId"],
      },
    ],
  },
);

export default Comment;
