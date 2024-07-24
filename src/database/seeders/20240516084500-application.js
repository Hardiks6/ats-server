'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const application = [];
    application.push({
      name: 'USER',
      client_id: 91081106034,
      client_secret: "Ci1qPBZ9pecvls70806MygLf1103LcXT"
    });
    return queryInterface.bulkInsert('applications', application, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('applications', null, {});
  }
};
