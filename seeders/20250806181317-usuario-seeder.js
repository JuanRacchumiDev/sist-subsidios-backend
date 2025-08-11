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
    const query = `SELECT id FROM perfil WHERE nombre = 'Administrador' LIMIT 1`;
    const perfilAdmin = await queryInterface.sequelize.query(
      query,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const perfilAdminId = perfilAdmin.length > 0 ? perfilAdmin[0].id : null

    if (!perfilAdminId) {
      console.error('Perfil Administrador no encontrado')
      return;
    }

    // Hash a password default
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('admin', salt)

    const now = new Date()

    await queryInterface.bulkInsert('usuario', [
      {
        id: uuidv4(),
        id_perfil: perfilAdminId,
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
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
