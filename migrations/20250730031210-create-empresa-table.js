'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('empresa', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING(13),
        allowNull: false
      },
      nombre_o_razon_social: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tipo_contribuyente: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      estado_sunat: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      condicion_sunat: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      departamento: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      provincia: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      distrito: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      direccion: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      direccion_completa: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      ubigeo_sunat: {
        type: Sequelize.STRING(10),
        allowNull: true
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
        defaultValue: true
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
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('empresa');
  }
};
