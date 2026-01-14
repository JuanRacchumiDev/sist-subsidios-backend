'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parametro', {
      clase: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      nombre_url: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.STRING(100),
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
      // Sequelize will automatically add `created_at` and `updated_at` if `timestamps: true` in your model.
      // However, it's good practice to define them explicitly in migrations for clarity and control.
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // MySQL: CURRENT_TIMESTAMP
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // MySQL: auto-update
        // For older Sequelize versions or other DBs, you might just use CURRENT_TIMESTAMP and let Sequelize handle updates.
        // For MySQL, `ON UPDATE CURRENT_TIMESTAMP` is common for `updated_at`.
      },
      deleted_at: { // Required because paranoid: true is set in the model
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      // Optional: Add table-level options here
      charset: 'utf8mb4', // Recommended for full Unicode support
      collate: 'utf8mb4_unicode_ci' // Recommended for full Unicode support
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('parametro');
  }
};
