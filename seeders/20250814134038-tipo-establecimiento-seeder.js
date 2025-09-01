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

    await queryInterface.bulkInsert('tipo_establecimiento', [
      {
        id: uuidv4(),
        nombre: 'HOSPITAL',
        nombre_url: 'hospital',
        sistema: true,
        estado: true
      },
      {
        id: uuidv4(),
        nombre: 'CLÍNICA PRIVADA',
        nombre_url: 'clinica-privada',
        sistema: true,
        estado: true
      },
      {
        id: uuidv4(),
        nombre: 'POSTA MÉDICA',
        nombre_url: 'posta-medica',
        sistema: true,
        estado: true
      },
      {
        id: uuidv4(),
        nombre: 'CENTRO DE SALUD',
        nombre_url: 'centro-de-salud',
        sistema: true,
        estado: true
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
    await queryInterface.bulkDelete('tipo_establecimiento', null, {})
  }
};
