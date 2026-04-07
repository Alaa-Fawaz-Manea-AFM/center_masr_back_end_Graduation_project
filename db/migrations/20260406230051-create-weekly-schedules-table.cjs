"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("weekly_schedules", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      centerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "centers", key: "id" },
        onDelete: "CASCADE",
      },
      classRoom: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.addIndex(
      "weekly_schedules",
      ["centerId", "classRoom"],
      { unique: true },
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("weekly_schedules");
  },
};
