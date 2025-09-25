import express from 'express'
import apiRoutes from './app/routes'
import cors from 'cors';

import sequelize from './config/database'

import { Bitacora } from './app/models/Bitacora'
import { TipoContingencia } from './app/models/TipoContingencia'
import { TipoDescansoMedico } from './app/models/TipoDescansoMedico'
import { TipoDocumento } from './app/models/TipoDocumento'
import { TipoEstablecimiento } from './app/models/TipoEstablecimiento'
import { Sede } from './app/models/Sede'
import { Area } from './app/models/Area'
import { Establecimiento } from './app/models/Establecimiento'
import { Perfil } from './app/models/Perfil'
import { Pais } from './app/models/Pais'
import { Parentesco } from './app/models/Parentesco'
import { Diagnostico } from './app/models/Diagnostico'
import { Cargo } from './app/models/Cargo'
import { Empresa } from './app/models/Empresa'
import { Persona } from './app/models/Persona'
import { Colaborador } from './app/models/Colaborador'
import { TrabajadorSocial } from './app/models/TrabajadorSocial'
import { DescansoMedico } from './app/models/DescansoMedico'
import { Canje } from './app/models/Canje'
import { Reembolso } from './app/models/Reembolso'
import { Cobro } from './app/models/Cobro'
import { DocumentoTipoCont } from './app/models/DocumentoTipoCont'
import { TipoAdjunto } from './app/models/TipoAdjunto'
import { Adjunto } from './app/models/Adjunto'
import { RepresentanteLegal } from './app/models/RepresentanteLegal'
import { Usuario } from './app/models/Usuario'

import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'

const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '*'

const app = express();

app.use(express.json());

app.use(express.static('public'))

app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Database synchronization and association setup
const setupDatabase = async () => {
    try {
        // Define associations
        Area.hasMany(Colaborador, { foreignKey: 'id_area', as: 'colaboradores' })
        Area.hasMany(TrabajadorSocial, { foreignKey: 'id_area', as: 'trabajadoresSociales' })

        Adjunto.belongsTo(TipoAdjunto, { foreignKey: 'id_tipoadjunto', as: 'tipoAdjunto' })
        Adjunto.belongsTo(DescansoMedico, { foreignKey: 'id_descansomedico', as: 'descansoMedico' })
        Adjunto.belongsTo(Canje, { foreignKey: 'id_canje', as: 'canje' })
        Adjunto.belongsTo(Cobro, { foreignKey: 'id_cobro', as: 'cobro' })
        Adjunto.belongsTo(Reembolso, { foreignKey: 'id_reembolso', as: 'reembolso' })
        Adjunto.belongsTo(Colaborador, { foreignKey: 'id_colaborador', as: 'colaborador' })
        Adjunto.belongsTo(TrabajadorSocial, { foreignKey: 'id_trabajadorsocial', as: 'trabajadorSocial' })
        Adjunto.belongsTo(DocumentoTipoCont, { foreignKey: 'id_documento', as: 'documentoTipoCont' })

        // Canje.hasOne(DescansoMedico, { foreignKey: 'id_canje', as: 'descansoMedico' })
        // Canje.belongsTo(Reembolso, { foreignKey: 'id_reembolso', as: 'reembolso' })
        Canje.hasMany(Adjunto, { foreignKey: 'id_canje', as: 'adjuntos' })
        Canje.belongsTo(DescansoMedico, { foreignKey: 'id_descansomedico', as: 'descansoMedico' })
        Canje.belongsTo(Colaborador, { foreignKey: 'id_colaborador', as: 'colaborador' })

        Cobro.hasOne(Reembolso, { foreignKey: 'id_cobro', as: 'reembolso' })
        Cobro.hasMany(Adjunto, { foreignKey: 'id_cobro', as: 'adjuntos' })

        Cargo.hasMany(Colaborador, { foreignKey: 'id_cargo', as: 'colaboradores' })
        Cargo.hasMany(RepresentanteLegal, { foreignKey: 'id_cargo', as: 'representantes' })

        Colaborador.belongsTo(Area, { foreignKey: 'id_area', as: 'area' })
        Colaborador.belongsTo(Cargo, { foreignKey: 'id_cargo', as: 'cargo' })
        Colaborador.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })
        Colaborador.belongsTo(Pais, { foreignKey: 'id_pais', as: 'pais' })
        Colaborador.belongsTo(Sede, { foreignKey: 'id_sede', as: 'sede' })
        Colaborador.hasMany(DescansoMedico, { foreignKey: 'id_colaborador', as: 'descansosMedicos' })
        Colaborador.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' })
        Colaborador.belongsTo(Parentesco, { foreignKey: 'id_parentesco', as: 'parentesco' })
        Colaborador.hasMany(Adjunto, { foreignKey: 'id_colaborador', as: 'adjuntos' })
        Colaborador.hasMany(Canje, { foreignKey: 'id_colaborador', as: 'canjes' })

        DescansoMedico.hasOne(Canje, { foreignKey: 'id_descansomedico', as: 'canje' })
        DescansoMedico.belongsTo(Colaborador, { foreignKey: 'id_colaborador', as: 'colaborador_dm' })
        DescansoMedico.belongsTo(TipoDescansoMedico, { foreignKey: 'id_tipodescansomedico', as: 'tipoDescansoMedico' })
        DescansoMedico.belongsTo(TipoContingencia, { foreignKey: 'id_tipocontingencia', as: 'tipoContingencia' })
        DescansoMedico.belongsTo(Diagnostico, { foreignKey: 'codcie10_diagnostico', as: 'diagnostico' })
        // DescansoMedico.belongsTo(Establecimiento, { foreignKey: 'id_establecimiento', as: 'establecimiento' })
        DescansoMedico.hasMany(Adjunto, { foreignKey: 'id_descansomedico', as: 'adjuntos' })

        Diagnostico.hasMany(DescansoMedico, { foreignKey: 'codcie10_diagnostico', as: 'descansosMedicos' })

        DocumentoTipoCont.belongsTo(TipoContingencia, { foreignKey: 'id_tipocontingencia', as: 'tipoContingencia' })
        DocumentoTipoCont.hasMany(Adjunto, { foreignKey: 'id_documento', as: 'adjuntos' })

        Empresa.hasMany(Colaborador, { foreignKey: 'id_empresa', as: 'colaboradores' })
        Empresa.hasMany(RepresentanteLegal, { foreignKey: 'id_empresa', as: 'representantes' })

        // Establecimiento.hasMany(DescansoMedico, { foreignKey: 'id_establecimiento', as: 'descansosMedicos' })
        Establecimiento.belongsTo(TipoEstablecimiento, { foreignKey: 'id_tipoestablecimiento', as: 'tipoEstablecimiento' })

        Pais.hasMany(Colaborador, { foreignKey: 'id_pais', as: 'colaboradores' })
        Pais.hasMany(TrabajadorSocial, { foreignKey: 'id_pais', as: 'trabajadoresSociales' })

        Parentesco.hasMany(Colaborador, { foreignKey: 'id_parentesco', as: 'colaboradores' })

        Persona.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })
        // Persona.hasOne(Usuario, { foreignKey: 'id_usuario', as: 'usuario' })

        Perfil.hasMany(Usuario, { foreignKey: 'id_perfil', as: 'usuarios' })

        // Reembolso.hasOne(Canje, { foreignKey: 'id_reembolso', as: 'canje' })
        Reembolso.belongsTo(Cobro, { foreignKey: 'id_cobro', as: 'cobro' })
        Reembolso.belongsTo(Canje, { foreignKey: 'id_canje', as: 'canje' })
        Reembolso.hasMany(Adjunto, { foreignKey: 'id_reembolso', as: 'adjuntos' })

        RepresentanteLegal.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })
        RepresentanteLegal.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' })
        RepresentanteLegal.belongsTo(Cargo, { foreignKey: 'id_cargo', as: 'cargo' })

        Sede.hasMany(Colaborador, { foreignKey: 'id_sede', as: 'colaboradores' })
        Sede.hasMany(TrabajadorSocial, { foreignKey: 'id_sede', as: 'trabajadoresSociales' })

        TipoContingencia.hasMany(DescansoMedico, { foreignKey: 'id_tipocontingencia', as: 'descansosMedicos' })
        TipoContingencia.hasMany(DocumentoTipoCont, { foreignKey: 'id_tipocontingencia', as: 'documentoTipoCont' })

        TipoDescansoMedico.hasMany(DescansoMedico, { foreignKey: 'id_tipodescansomedico', as: 'descansosMedicos' })

        TipoDocumento.hasMany(Colaborador, { foreignKey: 'id_tipodocumento', as: 'colaboradores' })
        TipoDocumento.hasMany(Persona, { foreignKey: 'id_tipodocumento', as: 'personas' })
        TipoDocumento.hasMany(RepresentanteLegal, { foreignKey: 'id_tipodocumento', as: 'representantes' })

        TipoEstablecimiento.hasMany(Establecimiento, { foreignKey: 'id_tipoestablecimiento', as: 'establecimiento' })

        TipoAdjunto.hasMany(Adjunto, { foreignKey: 'id_tipoadjunto', as: 'adjuntos' })

        TrabajadorSocial.belongsTo(Area, { foreignKey: 'id_area', as: 'area' })
        TrabajadorSocial.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento', as: 'tipoDocumento' })
        TrabajadorSocial.belongsTo(Pais, { foreignKey: 'id_pais', as: 'pais' })
        TrabajadorSocial.belongsTo(Sede, { foreignKey: 'id_sede', as: 'sede' })
        TrabajadorSocial.hasMany(DescansoMedico, { foreignKey: 'id_colaborador', as: 'descansosMedicos' })
        TrabajadorSocial.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' })
        TrabajadorSocial.belongsTo(Cargo, { foreignKey: 'id_cargo', as: 'cargo' })
        TrabajadorSocial.hasMany(Adjunto, { foreignKey: 'id_trabajadorsocial', as: 'adjuntos' })

        Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil', as: 'perfil' })
        Usuario.belongsTo(Colaborador, { foreignKey: 'id_colaborador', as: 'colaborador' })
        Usuario.belongsTo(TrabajadorSocial, { foreignKey: 'id_trabajadorsocial', as: 'trabajadorSocial' })
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