import express from 'express'
import apiRoutes from './app/routes'
import cors from 'cors';

import sequelize from './config/database'

import { Bitacora } from './app/models/Bitacora'
import { Establecimiento } from './app/models/Establecimiento'
import { Diagnostico } from './app/models/Diagnostico'
import { Empresa } from './app/models/Empresa'
import { Persona } from './app/models/Persona'
import { DescansoMedico } from './app/models/DescansoMedico'
import { Canje } from './app/models/Canje'
import { Reembolso } from './app/models/Reembolso'
import { Cobro } from './app/models/Cobro'
import { DocumentoTipoCont } from './app/models/DocumentoTipoCont'
import { TipoAdjunto } from './app/models/TipoAdjunto'
import { Adjunto } from './app/models/Adjunto'
import { Usuario } from './app/models/Usuario'
import { GrupoPersona } from './app/models/GrupoPersona'

import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import { DetalleParametro } from './app/models/DetalleParametro';

const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '*'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const setupDatabase = async () => {
    try {
        Adjunto.belongsTo(TipoAdjunto, { foreignKey: 'id_tipoadjunto', as: 'tipoAdjunto' })
        Adjunto.belongsTo(DescansoMedico, { foreignKey: 'id_descansomedico', as: 'descansoMedicoAdjunto' })
        Adjunto.belongsTo(Canje, { foreignKey: 'id_canje', as: 'canje' })
        Adjunto.belongsTo(Cobro, { foreignKey: 'id_cobro', as: 'cobro' })
        Adjunto.belongsTo(Reembolso, { foreignKey: 'id_reembolso', as: 'reembolso' })
        Adjunto.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' })
        Adjunto.belongsTo(DocumentoTipoCont, { foreignKey: 'id_documento', as: 'documentoTipoCont' })

        Canje.hasMany(Adjunto, { foreignKey: 'id_canje', as: 'adjuntos' })
        Canje.belongsTo(DescansoMedico, { foreignKey: 'id_descansomedico', as: 'descansoMedico' })
        Canje.belongsTo(Persona, { foreignKey: 'id_colaborador', as: 'colaborador' })

        Cobro.hasMany(Adjunto, { foreignKey: 'id_cobro', as: 'adjuntos' })
        Cobro.belongsTo(Reembolso, { foreignKey: 'id_reembolso', as: 'reembolso' })

        DescansoMedico.hasOne(Canje, { foreignKey: 'id_descansomedico', as: 'canje' })
        DescansoMedico.belongsTo(Persona, { foreignKey: 'id_colaborador', as: 'colaborador_dm' })
        DescansoMedico.belongsTo(DetalleParametro, { foreignKey: 'id_tipodescansomedico', as: 'tipoDescansoMedico' })
        DescansoMedico.belongsTo(DetalleParametro, { foreignKey: 'id_tipocontingencia', as: 'detalleParametro' })
        DescansoMedico.belongsTo(Diagnostico, { foreignKey: 'codcie10_diagnostico', as: 'diagnostico' })
        DescansoMedico.hasMany(Adjunto, { foreignKey: 'id_descansomedico', as: 'adjuntos' })

        Diagnostico.hasMany(DescansoMedico, { foreignKey: 'codcie10_diagnostico', as: 'descansosMedicos' })

        DocumentoTipoCont.belongsTo(DetalleParametro, { foreignKey: 'id_tipocontingencia', as: 'tipoContingencia' })
        DocumentoTipoCont.hasMany(Adjunto, { foreignKey: 'id_documento', as: 'adjuntos' })

        Empresa.hasMany(Persona, { foreignKey: 'id_empresa', as: 'colaboradores' })
        Empresa.hasMany(Persona, { foreignKey: 'id_empresa', as: 'representantes' })

        Establecimiento.belongsTo(DetalleParametro, { foreignKey: 'id_tipoestablecimiento', as: 'detalleParametro' })

        Persona.belongsTo(DetalleParametro, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })
        Persona.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' })
        Persona.belongsTo(DetalleParametro, { foreignKey: 'id_cargo', as: 'cargo' })
        Persona.hasMany(GrupoPersona, { foreignKey: 'id_persona', as: 'personaGrupos' });
        Persona.belongsToMany(DetalleParametro, {
            through: GrupoPersona,
            foreignKey: 'id_persona',
            otherKey: 'id_grupo',
            as: 'grupos'
        });
        Persona.hasOne(Usuario, { foreignKey: 'id_persona', as: 'usuario' });

        Reembolso.belongsTo(Canje, { foreignKey: 'id_canje', as: 'canje' })
        Reembolso.hasMany(Adjunto, { foreignKey: 'id_reembolso', as: 'adjuntos' })
        Reembolso.belongsTo(Persona, { foreignKey: 'id_colaborador', as: 'colaborador' })

        DetalleParametro.hasMany(Usuario, { foreignKey: 'id_perfil', as: 'usuarios' })
        DetalleParametro.hasMany(DescansoMedico, { foreignKey: 'id', as: 'descansosMedicos' })
        DetalleParametro.hasMany(DocumentoTipoCont, { foreignKey: 'id_tipocontingencia', as: 'documentoTipoCont' })
        DetalleParametro.hasMany(GrupoPersona, { foreignKey: 'id_grupo', as: 'grupoPersonas' });

        Usuario.belongsTo(DetalleParametro, { foreignKey: 'id_perfil', as: 'perfil' })
        Usuario.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' })

        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

setupDatabase();

// Documentación Server Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Agregamos API rutas principales
app.use('/api/v1', apiRoutes)

export default app