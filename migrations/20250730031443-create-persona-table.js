'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('persona', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_tipodocumento: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'detalle_parametro',
          key: 'id',
        },
      },
      id_empresa: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'empresa',
          key: 'id'
        }
      },
      id_cargo: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'detalle_parametro',
          key: 'id'
        }
      },
      id_sede: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'detalle_parametro',
          key: 'id'
        }
      },
      id_pais: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'detalle_parametro',
          key: 'id'
        }
      },
      numero_documento: {
        type: Sequelize.STRING(13),
        allowNull: false,
      },
      nombres: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      apellido_paterno: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      apellido_materno: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      nombre_completo: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      departamento: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      provincia: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      distrito: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      direccion_completa: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      email_personal: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      email_institucional: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      telefono: {
        type: Sequelize.STRING(13),
        allowNull: true
      },
      ubigeo_reniec: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      ubigeo_sunat: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      ubigeo: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      direccion_fiscal: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      partida_registral: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      ospe: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      fecha_nacimiento: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      fecha_ingreso: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      fecha_salida: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      nombre_area: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      nombre_sede: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      nombre_pais: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      estado_civil: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      foto: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      sexo: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      origen: {
        type: Sequelize.STRING(30),
        allowNull: false,
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
      is_asociado_sindicato: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_tiene_inconvenientes: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_representante_legal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('persona');
  }
};
