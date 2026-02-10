'use strict';

// const { default: bcrypt } = require('bcryptjs');
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // Obtener el ID del perfil administrador
    // const queryAdmin = `SELECT id FROM perfil WHERE nombre = 'ADMINISTRADOR' LIMIT 1`;
    let queryAdmin = `SELECT dp.id `;
    queryAdmin += `FROM detalle_parametro dp INNER JOIN parametro pr ON pr.clase = dp.parametro_clase `;
    queryAdmin += `WHERE pr.nombre = 'PERFIL' and dp.nombre = 'ADMINISTRADOR' LIMIT 1`;

    const perfilAdmin = await queryInterface.sequelize.query(
      queryAdmin,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const perfilAdminId = perfilAdmin.length > 0 ? perfilAdmin[0].id : null

    if (!perfilAdminId) {
      console.error('Perfil Administrador no encontrado')
      return;
    }

    // Obtener el ID del perfil especialista
    // const queryEsp = `SELECT id FROM perfil WHERE nombre = 'ESPECIALISTA' LIMIT 1`;
    let queryEspSH = `SELECT dp.id `;
    queryEspSH += `FROM detalle_parametro dp INNER JOIN parametro pr ON pr.clase = dp.parametro_clase `;
    queryEspSH += `WHERE pr.nombre = 'PERFIL' and dp.nombre = 'ESPECIALISTA SOPHIA HUMAN' LIMIT 1`;

    const perfilEspSH = await queryInterface.sequelize.query(
      queryEspSH,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const perfilEspecialistaSHId = perfilEspSH.length > 0 ? perfilEspSH[0].id : null

    if (!perfilEspecialistaSHId) {
      console.error('Perfil Especialista Sophia Human no encontrado')
      return;
    }

    // Hash a password default
    const salt = await bcrypt.genSalt(10)
    const hashedPasswordAdmin = await bcrypt.hash('admin', salt)
    const hashedPasswordEspecialistaSH = await bcrypt.hash('espsh', salt)

    const now = new Date()

    await queryInterface.bulkInsert('usuario', [
      {
        id: uuidv4(),
        id_perfil: perfilAdminId,
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPasswordAdmin,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        id_perfil: perfilEspecialistaSHId,
        username: 'espsh',
        email: 'esp@sophiahuman.com',
        password: hashedPasswordEspecialistaSH,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('usuario', null, {})
  }
};
