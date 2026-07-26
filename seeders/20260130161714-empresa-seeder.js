'use strict';
const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    await queryInterface.bulkInsert('empresa', [
      {
        id: uuidv4(),
        numero: "20603376014",
        nombre_o_razon_social: "SOPHIA HUMAN S.A.C.",
        estado_sunat: "ACTIVO",
        condicion_sunat: "HABIDO",
        departamento: "LIMA",
        provincia: "LIMA",
        distrito: "LA VICTORIA",
        direccion: "Av. Nicolas Arriola Nro. 314 Dpto. D Int. 1101",
        direccion_completa: "Av. Nicolas Arriola Nro. 314 Dpto. D Int. 1101, LIMA - LIMA - LA VICTORIA",
        ubigeo_sunat: "150115",
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('empresa', null, {})
  }
};
