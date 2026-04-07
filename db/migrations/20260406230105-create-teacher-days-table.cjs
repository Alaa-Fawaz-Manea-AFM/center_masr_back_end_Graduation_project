"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("teacherDays", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      teacherId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "teachers", key: "id" },
        onDelete: "CASCADE",
      },
      Weekly_scheduleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "weekly_schedules", key: "id" },
        onDelete: "CASCADE",
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      day: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      studyMaterial: {
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
      "teacherDays",
      ["teacherId", "Weekly_scheduleId", "day", "time"],
      { unique: true },
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("teacherDays");
  },
};
