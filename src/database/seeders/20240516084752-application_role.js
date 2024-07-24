'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const applicationRoles = [];
    applicationRoles.push({
      application_id: '1',
      role: 'Admin',
      created_at: new Date(),
      updated_at: new Date()
    });
    return queryInterface.bulkInsert('application_roles', applicationRoles, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('application_roles', null, {});
  }
};
