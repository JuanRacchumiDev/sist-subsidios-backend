'use strict';

// const { v4: uuidv4 } = require('uuid')

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

    await queryInterface.bulkInsert('parametro', [
      {
        clase: 1000,
        nombre: 'TIPO DOCUMENTO',
        nombre_url: 'tipo-documento'
      },
      {
        clase: 1001,
        nombre: 'PERFIL',
        nombre_url: 'perfil'
      },
      {
        clase: 1002,
        nombre: 'GRUPO',
        nombre_url: 'grupo'
      },
      {
        clase: 1003,
        nombre: 'TIPO DESCANSO MÉDICO',
        nombre_url: 'tipo-descanso-medico'
      },
      {
        clase: 1004,
        nombre: 'TIPO CONTINGENCIA',
        nombre_url: 'tipo-contingencia'
      },
      {
        clase: 1005,
        nombre: 'TIPO ESTABLECIMIENTO',
        nombre_url: 'tipo-establecimiento'
      },
      {
        clase: 1006,
        nombre: 'TIPO ADJUNTO',
        nombre_url: 'tipo-adjunto'
      },
      {
        clase: 1007,
        nombre: 'ÁREA',
        nombre_url: 'area'
      },
      {
        clase: 1008,
        nombre: 'CARGO',
        nombre_url: 'cargo'
      },
      {
        clase: 1009,
        nombre: 'PAÍS',
        nombre_url: 'pais'
      },
      {
        clase: 1010,
        nombre: 'SEDE',
        nombre_url: 'sede'
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
    await queryInterface.bulkDelete('parametro', null, {})
  }
};
