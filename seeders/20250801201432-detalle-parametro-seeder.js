'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Detalle parámetro - tipo documento
    const nombreTipoDocumento = 'tipo-documento'

    const parametroTipoDocumento = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreTipoDocumento LIMIT 1;`,
      {
        replacements: { nombreTipoDocumento: nombreTipoDocumento },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (!parametroTipoDocumento || parametroTipoDocumento.length === 0) {
      console.warn(`Parámetro principal no encontrado: ${nombreTipoDocumento}. Seeder omitido.`);
      return;
    }

    const parametroTipoDocumentoClase = parametroTipoDocumento[0].clase;

    const detalleParametroTipoDocumentoData = [
      {
        id: uuidv4(),
        parametro_clase: parametroTipoDocumentoClase,
        nombre: 'DOCUMENTO NACIONAL DE IDENTIDAD',
        nombre_url: 'documento-nacional-de-identidad',
        abreviatura: 'DNI',
        longitud: 8,
        en_persona: true,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroTipoDocumentoClase,
        nombre: 'CARNÉT DE EXTRANJERÍA',
        nombre_url: 'carnet-de-extranjeria',
        abreviatura: 'CE',
        longitud: 13,
        en_persona: true,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroTipoDocumentoClase,
        nombre: 'REGISTRO ÚNICO DE CONTRIBUYENTE',
        nombre_url: 'registro-unico-de-contribuyente',
        abreviatura: 'RUC',
        longitud: 11,
        en_persona: false,
        en_empresa: true,
        compra: true,
        venta: true,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('detalle_parametro', detalleParametroTipoDocumentoData, {})

    // Detalle parámetro perfil
    const nombrePerfil = 'perfil'

    const parametroPerfil = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombrePerfil LIMIT 1;`,
      {
        replacements: { nombrePerfil: nombrePerfil },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (!parametroPerfil || parametroPerfil.length === 0) {
      console.warn(`Parámetro principal no encontrado: ${nombreTipoDocumento}. Seeder omitido.`);
      return;
    }

    const parametroPerfilClase = parametroPerfil[0].clase;

    const detalleParametroPerfilData = [
      {
        id: uuidv4(),
        parametro_clase: parametroPerfilClase,
        nombre: 'ADMINISTRADOR',
        nombre_url: 'administrador',
        abreviatura: 'ADMIN',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroPerfilClase,
        nombre: 'ESPECIALISTA SOPHIA HUMAN',
        nombre_url: 'especialista-sophia-human',
        abreviatura: 'ESP SH',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroPerfilClase,
        nombre: 'ESPECIALISTA CLIENTE',
        nombre_url: 'especialista-cliente',
        abreviatura: 'ESP',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroPerfilClase,
        nombre: 'COLABORADOR',
        nombre_url: 'colaborador',
        abreviatura: 'COL',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('detalle_parametro', detalleParametroPerfilData, {})

    // Detalle parámetro - grupo
    const nombreGrupo = 'grupo'

    const parametroGrupo = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreGrupo LIMIT 1;`,
      {
        replacements: { nombreGrupo: nombreGrupo },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (!parametroGrupo || parametroGrupo.length === 0) {
      console.warn(`Parámetro principal no encontrado: ${nombreGrupo}. Seeder omitido.`);
      return;
    }

    const parametroGrupoClase = parametroGrupo[0].clase;

    const detalleParametroGrupoData = [
      {
        id: uuidv4(),
        parametro_clase: parametroGrupoClase,
        nombre: 'GRUPO COLABORADOR',
        nombre_url: 'grupo-colaborador',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroGrupoClase,
        nombre: 'GRUPO ESPECIALISTA SH',
        nombre_url: 'grupo-especialista-sh',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroGrupoClase,
        nombre: 'GRUPO ESPECIALISTA CLIENTE',
        nombre_url: 'grupo-especialista-cliente',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroGrupoClase,
        nombre: 'GRUPO REPRESENTANTE LEGAL',
        nombre_url: 'grupo-representante-legal',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroGrupoClase,
        nombre: 'GRUPO TRABAJADOR SOCIAL',
        nombre_url: 'grupo-trabajador-social',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('detalle_parametro', detalleParametroGrupoData, {})

    // Detalle parámetro - tipo descanso médico
    const nombreTipoDescansoMedico = 'tipo-descanso-medico'

    const parametroTipoDescansoMedico = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreTipoDescansoMedico LIMIT 1;`,
      {
        replacements: { nombreTipoDescansoMedico: nombreTipoDescansoMedico },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (!parametroTipoDescansoMedico || parametroTipoDescansoMedico.length === 0) {
      console.warn(`Parámetro principal no encontrado: ${nombreTipoDescansoMedico}. Seeder omitido.`);
      return;
    }

    const parametroTipoDMClase = parametroTipoDescansoMedico[0].clase;

    const detalleParametroTipoDMData = [
      {
        id: uuidv4(),
        parametro_clase: parametroTipoDMClase,
        nombre: 'CITT',
        nombre_url: 'citt',
        abreviatura: 'CITT',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroTipoDMClase,
        nombre: 'PARTICULAR',
        nombre_url: 'particular',
        abreviatura: 'PARTICULAR',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('detalle_parametro', detalleParametroTipoDMData, {})

    // Detalle parámetro - tipo contingencia
    const nombreTipoContingencia = 'tipo-contingencia'

    const parametroTipoContingencia = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreTipoContingencia LIMIT 1;`,
      {
        replacements: { nombreTipoContingencia: nombreTipoContingencia },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (!parametroTipoContingencia || parametroTipoContingencia.length === 0) {
      console.warn(`Parámetro principal no encontrado: ${nombreTipoContingencia}. Seeder omitido.`);
      return;
    }

    const parametroTipoContingenciaClase = parametroTipoContingencia[0].clase;

    const detalleParametroTipoContingenciaData = [
      {
        id: uuidv4(),
        parametro_clase: parametroTipoContingenciaClase,
        nombre: 'ENFERMEDAD COMÚN',
        nombre_url: 'enfermedad-comun',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroTipoContingenciaClase,
        nombre: 'ACCIDENTE DE TRABAJO',
        nombre_url: 'accidente-de-trabajo',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroTipoContingenciaClase,
        nombre: 'ACCIDENTE DE TRÁNSITO',
        nombre_url: 'accidente-de-transito',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroTipoContingenciaClase,
        nombre: 'MATERNIDAD',
        nombre_url: 'maternidad',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('detalle_parametro', detalleParametroTipoContingenciaData, {})

    // Detalle parámetro - tipo adjunto
    const nombreTipoAdjunto = 'tipo-adjunto'

    const parametroTipoAdjunto = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreTipoAdjunto LIMIT 1;`,
      {
        replacements: { nombreTipoAdjunto: nombreTipoAdjunto },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (!parametroTipoAdjunto || parametroTipoAdjunto.length === 0) {
      console.warn(`Parámetro principal no encontrado: ${parametroTipoAdjunto}. Seeder omitido.`);
      return;
    }

    const parametroTipoAdjuntoClase = parametroTipoAdjunto[0].clase;

    const detalleParametroTipoAdjuntoData = [
      {
        id: uuidv4(),
        parametro_clase: parametroTipoAdjuntoClase,
        nombre: 'GENERAL',
        nombre_url: 'general',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('detalle_parametro', detalleParametroTipoAdjuntoData, {})

    // Detalle parámetro - cargo
    const nombreCargo = 'cargo'

    const parametroCargo = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreCargo LIMIT 1;`,
      {
        replacements: { nombreCargo: nombreCargo },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (!parametroCargo || parametroCargo.length === 0) {
      console.warn(`Parámetro principal no encontrado: ${parametroCargo}. Seeder omitido.`);
      return;
    }

    const parametroCargoClase = parametroCargo[0].clase;

    const detalleParametroCargoData = [
      {
        id: uuidv4(),
        parametro_clase: parametroCargoClase,
        nombre: 'SUPERVISOR',
        nombre_url: 'supervisor',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        parametro_clase: parametroCargoClase,
        nombre: 'GERENTE',
        nombre_url: 'gerente',
        en_persona: false,
        en_empresa: false,
        compra: false,
        venta: false,
        visible: true,
        sistema: true,
        estado: true,
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('detalle_parametro', detalleParametroCargoData, {})
  },

  async down(queryInterface, Sequelize) {
    // Eliminar los registros de tipo de documento
    const nombreTipoDocumento = 'tipo-documento'

    const parametroTipoDocumento = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreTipoDocumento LIMIT 1;`,
      {
        replacements: { nombreTipoDocumento: nombreTipoDocumento },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (parametroTipoDocumento && parametroTipoDocumento.length > 0) {
      const parametroTipoDocumentoClase = parametroTipoDocumento[0].clase;

      await queryInterface.bulkDelete('detalle_parametro', {
        parametro_clase: parametroTipoDocumentoId
      }, {});
    } else {
      console.log('else parametroTipoDocumento')
    }

    // Eliminar los registros de grupo
    const nombreGrupo = 'grupo'

    const parametroGrupo = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreGrupo LIMIT 1;`,
      {
        replacements: { nombreGrupo: nombreGrupo },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (parametroGrupo && parametroGrupo.length > 0) {
      const parametroGrupoClase = parametroGrupo[0].clase;

      await queryInterface.bulkDelete('detalle_parametro', {
        parametro_clase: parametroGrupoId
      }, {});
    } else {
      console.log('else parametroGrupo')
    }

    // Eliminar los registros de tipo de descanso médico
    const nombreTipoDM = 'tipo-descanso-medico'

    const parametroTipoDM = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreTipoDM LIMIT 1;`,
      {
        replacements: { nombreTipoDM: nombreTipoDM },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (parametroTipoDM && parametroTipoDM.length > 0) {
      const parametroTipoDMClase = parametroTipoDM[0].clase;

      await queryInterface.bulkDelete('detalle_parametro', {
        parametro_clase: parametroTipoDMId
      }, {});
    } else {
      console.log('else parametroTipoDM')
    }

    // Eliminar los registros de tipo de contingencia
    const nombreTipoContingencia = 'tipo-contingencia'

    const parametroTipoContingencia = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreTipoContingencia LIMIT 1;`,
      {
        replacements: { nombreTipoContingencia: nombreTipoContingencia },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (parametroTipoContingencia && parametroTipoContingencia.length > 0) {
      const parametroTipoContingenciaClase = parametroTipoContingencia[0].clase;

      await queryInterface.bulkDelete('detalle_parametro', {
        parametro_clase: parametroTipoContingenciaId
      }, {});
    } else {
      console.log('else parametroTipoContingencia')
    }

    // Eliminar los registros de tipo adjunto
    const nombreTipoAdjunto = 'tipo-adjunto'

    const parametroTipoAdjunto = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreTipoAdjunto LIMIT 1;`,
      {
        replacements: { nombreTipoAdjunto: nombreTipoAdjunto },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (parametroTipoAdjunto && parametroTipoAdjunto.length > 0) {
      const parametroTipoAdjuntoClase = parametroTipoAdjunto[0].clase;

      await queryInterface.bulkDelete('detalle_parametro', {
        parametro_clase: parametroTipoAdjuntoId
      }, {});
    } else {
      console.log('else parametroTipoAdjunto')
    }

    // Eliminar los registros de cargo
    const nombreCargo = 'cargo'

    const parametroCargo = await queryInterface.sequelize.query(
      `SELECT clase FROM parametro WHERE nombre_url = :nombreCargo LIMIT 1;`,
      {
        replacements: { nombreCargo: nombreCargo },
        type: queryInterface.sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (parametroCargo && parametroCargo.length > 0) {
      const parametroCargoClase = parametroCargo[0].clase;

      await queryInterface.bulkDelete('detalle_parametro', {
        parametro_clase: parametroCargoClase
      }, {});
    } else {
      console.log('else parametroCargo')
    }
  }
};
