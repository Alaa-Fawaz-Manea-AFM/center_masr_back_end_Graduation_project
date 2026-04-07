"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("teachers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      classRoom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      studyMaterial: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      studySystem: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ["arabic"],
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
    await queryInterface.addIndex("teachers", ["classRoom", "studyMaterial"]);
    await queryInterface.addIndex("teachers", ["userId"], { unique: true });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("teachers");
  },
};
