'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
      id_colaborador: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'persona',
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
      codigo_reembolso: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      numero_expediente: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      fecha_solicitud: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_registro: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_reembolso: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      fecha_maxima_reembolso: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      fecha_maxima_subsanar: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      fecha_pago: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      fecha_actualiza: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      valor_dia: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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
      nombre_colaborador: {
        type: Sequelize.STRING(80),
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
        defaultValue: false
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('reembolso');
  }
};
