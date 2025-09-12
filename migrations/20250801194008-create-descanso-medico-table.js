'use strict';

const { STRING } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('descanso_medico', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_colaborador: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'colaborador',
          key: 'id'
        }
      },
      id_tipodescansomedico: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tipo_descansomedico',
          key: 'id'
        }
      },
      id_tipocontingencia: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tipo_contingencia',
          key: 'id'
        }
      },
      codcie10_diagnostico: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'diagnostico',
          key: 'codCie10'
        }
      },
      // id_establecimiento: {
      //   type: Sequelize.UUID,
      //   allowNull: false,
      //   references: {
      //     model: 'establecimiento',
      //     key: 'id'
      //   }
      // },
      codigo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      fecha_otorgamiento: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_inicio: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_final: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_registro: {
        type: Sequelize.STRING(12),
        allowNull: false
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
      numero_colegiatura: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      medico_tratante: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      nombre_colaborador: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      nombre_tipodescansomedico: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      nombre_tipocontingencia: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      nombre_diagnostico: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nombre_establecimiento: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      observacion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      total_dias: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      codigo_temp: {
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
        allowNull: false
      },
      is_subsidio: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_acepta_responsabilidad: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_acepta_politica: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_continuo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      estado_registro: {
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable('descanso_medico');
  }
};
