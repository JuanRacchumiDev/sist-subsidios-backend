'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    await queryInterface.bulkInsert('parametro', [
      {
        clase: 1000,
        nombre: 'TIPO DOCUMENTO',
        nombre_url: 'tipo-documento',
        sistema: true
      },
      {
        clase: 1001,
        nombre: 'PERFIL',
        nombre_url: 'perfil',
        sistema: true
      },
      {
        clase: 1002,
        nombre: 'GRUPO',
        nombre_url: 'grupo',
        sistema: true
      },
      {
        clase: 1003,
        nombre: 'TIPO DESCANSO MÉDICO',
        nombre_url: 'tipo-descanso-medico',
        sistema: true
      },
      {
        clase: 1004,
        nombre: 'TIPO CONTINGENCIA',
        nombre_url: 'tipo-contingencia',
        sistema: true
      },
      {
        clase: 1005,
        nombre: 'TIPO ESTABLECIMIENTO',
        nombre_url: 'tipo-establecimiento',
        sistema: true
      },
      {
        clase: 1006,
        nombre: 'TIPO ADJUNTO',
        nombre_url: 'tipo-adjunto',
        sistema: true
      },
      {
        clase: 1007,
        nombre: 'ÁREA',
        nombre_url: 'area',
        sistema: true
      },
      {
        clase: 1008,
        nombre: 'CARGO',
        nombre_url: 'cargo',
        sistema: true
      },
      {
        clase: 1009,
        nombre: 'PAÍS',
        nombre_url: 'pais',
        sistema: true
      },
      {
        clase: 1010,
        nombre: 'SEDE',
        nombre_url: 'sede',
        sistema: true
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('parametro', null, {})
  }
};
