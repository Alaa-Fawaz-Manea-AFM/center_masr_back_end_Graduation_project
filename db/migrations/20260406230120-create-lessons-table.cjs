"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lessons", {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      studyMaterial: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      classRoom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vedioUrl: {
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
    await queryInterface.addIndex("lessons", ["teacherId"]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("lessons");
  },
};
