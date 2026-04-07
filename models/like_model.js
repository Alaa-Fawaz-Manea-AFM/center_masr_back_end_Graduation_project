import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Post from "./post_model.js";
import User from "./user_model.js";

const Like = sequelize.define(
  "like",
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
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "postId"],
      },
    ],
  },
);

export default Like;
