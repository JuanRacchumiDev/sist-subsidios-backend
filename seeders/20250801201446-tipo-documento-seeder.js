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

    await queryInterface.bulkInsert('tipo_documento', [
      {
        id: uuidv4(),
        nombre: 'DNI',
        nombre_url: 'dni',
        abreviatura: 'DNI',
        longitud: 8,
        en_persona: true,
        en_empresa: false,
        compra: true,
        venta: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'CARNET DE EXTRANJERÍA',
        nombre_url: 'carnet-de-extranjeria',
        abreviatura: 'C.EXT',
        longitud: 9,
        en_persona: true,
        en_empresa: false,
        compra: true,
        venta: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'PASAPORTE',
        nombre_url: 'pasaporte',
        abreviatura: 'PASS',
        longitud: 12,
        en_persona: true,
        en_empresa: false,
        compra: true,
        venta: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        nombre: 'REGISTRO ÚNICO DE CONTRIBUYENTE',
        nombre_url: 'registro-unico-de-contribuyente',
        abreviatura: 'RUC',
        longitud: 11,
        en_persona: false,
        en_empresa: true,
        compra: true,
        venta: true,
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
    await queryInterface.bulkDelete('tipo_documento', null, {})
  }
};
