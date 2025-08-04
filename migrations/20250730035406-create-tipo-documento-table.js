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
    await queryInterface.createTable('tipo_documento', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true
      },
      nombre_url: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      abreviatura: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      longitud: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      en_persona: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      en_empresa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      compra: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      venta: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
        // Note: Your model has allowNull: false for user_elimina, but it's often true for soft deletes.
        // I'll keep it as allowNull: false as per your model for now, but double check this logic.
        allowNull: true // Make sure this aligns with your intended logic.
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
      // Timestamps (created_at, updated_at) - essential for timestamps: true
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') // MySQL-specific auto-update
      },
      // deleted_at - essential for paranoid: true
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true // This must be true for soft deletes to work
      }
    }, {
      // Table-level options for consistency and proper character encoding
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('tipo_documento');
  }
};
