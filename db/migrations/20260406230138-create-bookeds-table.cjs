"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bookeds", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "students", key: "id" },
        onDelete: "CASCADE",
      },
      teacherDayId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "teacherDays", key: "id" },
        onDelete: "CASCADE",
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
    await queryInterface.addIndex("bookeds", ["studentId", "teacherDayId"], {
      unique: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("bookeds");
  },
};
