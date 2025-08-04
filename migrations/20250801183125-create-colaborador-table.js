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
    await queryInterface.createTable('colaborador', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      id_parentesco: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'parentesco',
          key: 'id'
        }
      },
      id_tipodocumento: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tipo_documento',
          key: 'id'
        }
      },
      id_area: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'area',
          key: 'id'
        }
      },
      id_sede: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'sede',
          key: 'id'
        }
      },
      id_pais: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'pais',
          key: 'id'
        }
      },
      id_empresa: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'empresa',
          key: 'id'
        }
      },
      numero_documento: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
      },
      apellido_paterno: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      apellido_materno: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      nombres: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      nombre_completo: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      fecha_nacimiento: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      fecha_ingreso: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      fecha_salida: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      nombre_area: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      nombre_sede: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      nombre_pais: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      correo_institucional: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      correo_personal: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      numero_celular: {
        type: Sequelize.STRING(13),
        allowNull: false
      },
      contacto_emergencia: {
        type: Sequelize.STRING(80),
        allowNull: true
      },
      numero_celular_emergencia: {
        type: Sequelize.STRING(13),
        allowNull: true
      },
      foto: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      curriculum_vitae: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      is_asociado_sindicato: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_presenta_inconvenientes: {
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
        defaultValue: false
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
    await queryInterface.dropTable('colaborador');
  }
};
