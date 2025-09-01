'use strict';

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

    await queryInterface.bulkInsert('diagnostico', [
      {
        codCie10: 'A01.0',
        nombre: 'FIEBRE TIFOIDEA',
        tiempo: 9,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A01.4',
        nombre: 'FIEBRE PARATIFOIDEA, NO ESPECIFICADA',
        tiempo: 9,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A02.0',
        nombre: 'ENTERITIS DEBIDA A SALMONELLA',
        tiempo: 3,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A02.8',
        nombre: 'OTRAS INFECCIONES ESPECIFICADAS COMO DEBIDAS A SALMONELLA',
        tiempo: 3,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A02.9',
        nombre: 'INFECCION DEBIDA A SALMONELLA, NO ESPECIFICADA',
        tiempo: 3,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A03.9',
        nombre: 'SHIGELOSIS DE TIPO NO ESPECIFICADO',
        tiempo: 5,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.0',
        nombre: 'INFECCION DEBIDA A ESCHERICHIA COLI ENTEROPATOGENA',
        tiempo: 3,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.1',
        nombre: 'INFECCION DEBIDA A ESCHERICHIA COLI ENTEROTOXIGENA',
        tiempo: 3,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.2',
        nombre: 'INFECCION DEBIDA A ESCHERICHIA COLI ENTEROINVASIVA',
        tiempo: 3,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.3',
        nombre: 'INFECCION DEBIDA A ESCHERICHIA COLI ENTEROHEMORRAGICA',
        tiempo: 3,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.4',
        nombre: 'OTRAS INFECCIONES INTESTINALES DEBIDAS A ESCHERICHIA COLI',
        tiempo: 3,
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
    await queryInterface.bulkDelete('diagnostico', null, {})
  }
};
