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

    await queryInterface.bulkInsert('perfil', [
      {
        id: uuidv4(),
        nombre: 'ADMINISTRADOR',
        nombre_url: 'administrador',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'ESPECIALISTA',
        nombre_url: 'especialista',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'COLABORADOR',
        nombre_url: 'colaborador',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'MÉDICO OCUPACIONAL',
        nombre_url: 'medico-ocupacional',
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
    await queryInterface.bulkDelete('perfil', null, {})
  }
};
