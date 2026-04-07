"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("profile_centers", {
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
      bio: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      whatsApp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactUsPhone: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      studyMaterial: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      contactUsEmail: {
        type: Sequelize.ARRAY(Sequelize.STRING),
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
    await queryInterface.addIndex("profile_centers", ["userId"], {
      unique: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("profile_centers");
  },
};
