'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('configuracion', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      clave: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      valor: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tipo_dato: {
        type: Sequelize.ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON'),
        allowNull: false,
        defaultValue: 'STRING'
      },
      criterio: {
        type: Sequelize.STRING(50), // Ejm: 'SUBSIDIOS', 'NOTIFICACIONES', 'EMAIL', 'SISTEMA'
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(250),
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('configuracion')
  }
};
