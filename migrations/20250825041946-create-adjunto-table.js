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
    await queryInterface.createTable('adjunto', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_tipoadjunto: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tipo_adjunto',
          key: 'id'
        }
      },
      id_descansomedico: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'descanso_medico',
          key: 'id'
        }
      },
      id_canje: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'canje',
          key: 'id'
        }
      },
      id_cobro: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'cobro',
          key: 'id'
        }
      },
      id_reembolso: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'reembolso',
          key: 'id'
        }
      },
      id_colaborador: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'colaborador',
          key: 'id'
        }
      },
      id_trabajadorsocial: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'trabajador_social',
          key: 'id'
        }
      },
      id_documento: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'documento_tipo_contingencia',
          key: 'id'
        }
      },
      file_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      file_type: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      file_data: {
        type: Sequelize.BLOB('long'),
        allowNull: true
      },
      file_path: {
        type: Sequelize.STRING(100),
        allowNull: true
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Común en MySQL para auto-actualización
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
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('adjunto');
  }
};
