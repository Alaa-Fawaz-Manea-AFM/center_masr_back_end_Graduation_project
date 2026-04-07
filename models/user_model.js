import { compare, hash } from "bcryptjs";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // move
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("teacher", "center", "student", "admin"),
      defaultValue: "student",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followerCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    followingCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    postCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["name"],
      },
      {
        unique: true,
        fields: ["email"],
      },
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await hash(user.password, 10);
        }
      },
    },
  },
);

User.passwordMatches = async (password, hash) => {
  return await compare(password, hash);
};
export default User;
