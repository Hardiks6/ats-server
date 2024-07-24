'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        uniqueKey: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profile_image: {
        type: Sequelize.STRING
      },
      application_role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'application_roles',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      reset_password_token: {
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('I', 'P', 'A'),
        defaultValue: "I"
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};