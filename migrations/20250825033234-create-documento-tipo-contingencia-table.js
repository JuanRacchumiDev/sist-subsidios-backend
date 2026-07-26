'use strict';

const { DATE } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documento_tipo_contingencia', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_tipocontingencia: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'detalle_parametro',
          key: 'id'
        }
      },
      nombre: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      nombre_url: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      user_crea: {
        type: Sequelize.UUID,
        allowNull: true
      },
      user_actualiza: {
        type: Sequelize.UUID,
        allowNull: true
      },
      user_elimina: {
        type: Sequelize.UUID,
        allowNull: true
      },
      sistema: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('documento_tipo_contingencia');
  }
};
