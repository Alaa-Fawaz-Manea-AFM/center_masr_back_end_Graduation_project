import { User } from "./index.js";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Follower = sequelize.define(
  "follower",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    followingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    followerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["followingId", "followerId"],
      },
    ],
  },
);

export default Follower;
