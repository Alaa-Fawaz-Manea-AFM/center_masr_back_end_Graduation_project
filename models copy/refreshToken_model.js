import { compare, hash } from "bcryptjs";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { User } from "./index.js";

const RefreshToken = sequelize.define(
  "refreshToken",
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
    refresh_token: {
      type: DataTypes.TEXT,
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
    hooks: {
      beforeCreate: async (refreshToken) => {
        if (refreshToken.refresh_token) {
          refreshToken.refresh_token = await hash(
            refreshToken.refresh_token,
            10,
          );
        }
      },
      beforeUpdate: async (refreshToken) => {
        if (refreshToken.changed("refresh_token")) {
          refreshToken.refresh_token = await hash(
            refreshToken.refresh_token,
            10,
          );
        }
      },
    },
  },
);

RefreshToken.verifyTokenMatches = async (token, hash) => {
  return await compare(token, hash);
};

export default RefreshToken;
