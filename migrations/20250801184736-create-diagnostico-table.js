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
    await queryInterface.createTable('diagnostico', {
      codCie10: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      nombre_url: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      tiempo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sexo: {
        type: Sequelize.CHAR(1),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') // Común en MySQL para auto-actualización
      },
      // `deleted_at` necesario debido a `paranoid: true` en el modelo
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true // Debe ser anulable para el borrado suave
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
    await queryInterface.dropTable('diagnostico');
  }
};
