'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('reembolso', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_canje: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'canje',
          key: 'id'
        }
      },
      codigo: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_registro: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      fecha_maxima_reembolso: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      fecha_maxima_subsanar: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      is_cobrable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      observacion: {
        type: Sequelize.TEXT,
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
      estado_registro: {
        type: Sequelize.STRING(30),
        allowNull: false
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
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      // Opciones de la tabla (opcional pero recomendado para la consistencia de la base de datos)
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('reembolso');
  }
};
