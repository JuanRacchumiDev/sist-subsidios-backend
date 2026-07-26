'use strict';

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {

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
        sistema: false,
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
        sistema: false,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuario', null, {})
  }
};
