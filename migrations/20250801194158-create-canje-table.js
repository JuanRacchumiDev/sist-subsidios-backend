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
    await queryInterface.createTable('canje', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_descansomedico: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'descanso_medico',
          key: 'id'
        }
      },
      correlativo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true
      },
      codigo: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      fecha_inicio_subsidio: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_final_subsidio: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_inicio_dm: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_final_dm: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_maxima_canje: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_registro: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      fecha_actualiza: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      fecha_elimina: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      fecha_maxima_subsanar: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      dia_fecha_inicio_subsidio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mes_fecha_inicio_subsidio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      anio_fecha_inicio_subsidio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dia_fecha_final_subsidio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mes_fecha_final_subsidio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      anio_fecha_final_subsidio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_reembolsable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      observacion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      mes_devengado: {
        type: Sequelize.STRING(12),
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
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('descanso_medico');
  }
};
