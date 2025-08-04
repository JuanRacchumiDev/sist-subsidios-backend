'use strict';

const { v4: uuidv4 } = require('uuid')

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
    const now = new Date()

    await queryInterface.bulkInsert('tipo_descansomedico', [
      {
        id: uuidv4(),
        nombre: 'PARTICULAR',
        nombre_url: 'particular',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'CITT',
        nombre_url: 'citt',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('tipo_descansomedico', null, {})
  }
};
