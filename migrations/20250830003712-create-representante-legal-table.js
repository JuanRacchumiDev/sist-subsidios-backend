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
    await queryInterface.createTable('representante_legal', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_tipodocumento: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'tipo_documento',
          key: 'id'
        }
      },
      id_empresa: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'empresa',
          key: 'id'
        }
      },
      id_cargo: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cargo',
          key: 'id'
        }
      },
      numero_documento: {
        type: Sequelize.STRING(13),
        allowNull: false
      },
      nombres: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      apellido_paterno: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      apellido_materno: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      direccion_fiscal: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      partida_registral: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      telefono: {
        type: Sequelize.STRING(13),
        allowNull: true
      },
      correo: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      ospe: {
        type: Sequelize.STRING(20),
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
    await queryInterface.dropTable('representante_legal');
  }
};
