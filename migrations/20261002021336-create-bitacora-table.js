'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bitacora', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_externo: {
        type: Sequelize.UUID,
        allowNull: false
      },
      tabla: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      valor_anterior: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      valor_nuevo: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      accion: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      fecha_registro: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      user_crea: {
        type: Sequelize.UUID,
        allowNull: false
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bitacora')
  }
};
