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

    await queryInterface.bulkInsert('tipo_contingencia', [
      {
        id: uuidv4(),
        nombre: 'Enfermedad Común',
        nombre_url: 'enfermedad-comun',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Accidente de Trabajo',
        nombre_url: 'accidente-de-trabajo',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Accidente de Tránsito',
        nombre_url: 'accidente-de-transito',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Maternidad',
        nombre_url: 'maternidad',
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'Subsidio de Lactancia',
        nombre_url: 'subsidio-de-lactancia',
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
    await queryInterface.bulkDelete('tipo_contingencia', null, {})
  }
};
