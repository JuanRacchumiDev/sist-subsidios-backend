'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    await queryInterface.bulkInsert('diagnostico', [
      {
        codCie10: 'A01.0',
        nombre: 'FIEBRE TIFOIDEA',
        tiempo: 9,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A01.4',
        nombre: 'FIEBRE PARATIFOIDEA, NO ESPECIFICADA',
        tiempo: 9,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A02.0',
        nombre: 'ENTERITIS DEBIDA A SALMONELLA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A02.8',
        nombre: 'OTRAS INFECCIONES ESPECIFICADAS COMO DEBIDAS A SALMONELLA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A02.9',
        nombre: 'INFECCION DEBIDA A SALMONELLA, NO ESPECIFICADA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A03.9',
        nombre: 'SHIGELOSIS DE TIPO NO ESPECIFICADO',
        tiempo: 5,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.0',
        nombre: 'INFECCION DEBIDA A ESCHERICHIA COLI ENTEROPATOGENA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.1',
        nombre: 'INFECCION DEBIDA A ESCHERICHIA COLI ENTEROTOXIGENA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.2',
        nombre: 'INFECCION DEBIDA A ESCHERICHIA COLI ENTEROINVASIVA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.3',
        nombre: 'INFECCION DEBIDA A ESCHERICHIA COLI ENTEROHEMORRAGICA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.4',
        nombre: 'OTRAS INFECCIONES INTESTINALES DEBIDAS A ESCHERICHIA COLI',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.5',
        nombre: 'ENTERITIS DEBIDA A CAMPYLOBACTER',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.6',
        nombre: 'ENTERITIS DEBIDA A YERSINIA ENTEROCOLITICA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.7',
        nombre: 'ENTEROCOLITIS DEBIDA A CLOSTRIDIUM DIFFICILE',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.8',
        nombre: 'OTRAS INFECCIONES INTESTINALES BACTERIANAS ESPECIFICADAS',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A04.9',
        nombre: 'INFECCION INTESTINAL BACTERIANA, NO ESPECIFICADA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A05.0',
        nombre: 'INTOXICACION ALIMENTARIA ESTAFILOCOCICA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A05.9',
        nombre: 'INTOXICACION ALIMENTARIA BACTERIANA, NO ESPECIFICADA',
        tiempo: 3,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A06.0',
        nombre: 'DISENTERIA AMEBIANA AGUDA',
        tiempo: 7,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        codCie10: 'A06.1',
        nombre: 'AMEBIASIS INTESTINAL CRONICA',
        tiempo: 7,
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('diagnostico', null, {})
  }
};
