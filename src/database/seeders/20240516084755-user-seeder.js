'use strict';

import { hash } from "../../utils/hashing";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const users = [];
    users.push({
      name: 'Chirag M',
      email: "chirag.encodedots@gmail.com",
      password: hash("Admin@123?"),
      application_role_id: 1,
      status: 'A',  
      created_at: new Date(),
      updated_at: new Date(),
    });
    return queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
