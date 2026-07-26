'use strict';

const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('tipo_adjunto', [
      {
        id: uuidv4(),
        nombre: 'GENERAL',
        extensiones: 'application/pdf, image/png, image/jpeg',
        sistema: false,
        estado: true
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipo_adjunto', null, {})
  }
};
