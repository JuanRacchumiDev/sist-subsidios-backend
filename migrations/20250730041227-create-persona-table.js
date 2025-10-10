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
          model: 'tipo_documento', // Nombre de la tabla a la que hace referencia
          key: 'id',
        },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT', // Coincide con onDelete del modelo TipoDocumento.belongsTo(Persona)
      },
      numero_documento: {
        type: Sequelize.STRING(13),
        allowNull: false,
      },
      nombres: {
        type: Sequelize.STRING(40),
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
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      direccion_completa: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(60),
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
      fecha_nacimiento: {
        type: Sequelize.STRING(10), // Asumiendo formato 'YYYY-MM-DD' o similar
        allowNull: false
      },
      estado_civil: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      foto: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      sexo: {
        type: Sequelize.STRING(2), // M, F u otro
        allowNull: false,
      },
      origen: {
        type: Sequelize.STRING(30), // Para almacenar el string del ENUM EOrigen
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
      // Timestamps necesarios debido a `timestamps: true` en el modelo
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
    await queryInterface.dropTable('persona');
  }
};
