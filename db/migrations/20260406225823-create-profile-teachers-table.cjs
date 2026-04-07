"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("profile_teachers", {
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
      sharePrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      centersWhereHeStudie: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      educationalQualification: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      experienceYear: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      star: {
        type: Sequelize.FLOAT,
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
    await queryInterface.addIndex("profile_teachers", ["userId"], {
      unique: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("profile_teachers");
  },
};
