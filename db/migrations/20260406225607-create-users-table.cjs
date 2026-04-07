"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("teacher", "center", "student", "admin"),
        defaultValue: "student",
      },
      phone: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      followerCounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      followingCounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      postCounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("users", ["name"]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("users");
  },
};
