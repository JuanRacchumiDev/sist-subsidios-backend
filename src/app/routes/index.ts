import { Router } from 'express'
const router = Router()

import tipoEstablecimientoRoutes from './tipoEstablecimiento.routes'
import tipoDocumentoRoutes from './tipoDocumento.routes'
import tipoDescansoMedicoRoutes from './tipoDescansoMedico.routes'
import tipoContingenciaRoutes from './tipoContingencia.routes'
import areaRoutes from './area.routes'
import cargoRoutes from './cargo.routes'
import sedeRoutes from './sede.routes'
import perfilRoutes from './perfil.routes'
import personaRoutes from './persona.routes'
import empresaRoutes from './empresa.routes'
import diagnosticoRoutes from './diagnostico.routes'
import establecimientoRoutes from './establecimiento.routes'
import trabajadorSocialRoutes from './trabajadorSocial.routes'
import colaboradorRoutes from './colaborador.routes'
import usuarioRoutes from './usuario.routes'
import descansoMedicoRoutes from './descansoMedico.routes'
import canjeRoutes from './canje.routes'
import reembolsoRoutes from './reembolso.routes'
import cobroRoutes from './cobro.routes'
import documentoTipoContRoutes from './documentoTipoCont.routes'
import tipoAdjuntoRoutes from './tipoAdjunto.routes'
import adjuntoRoutes from './adjunto.routes'
import representanteLegalRoutes from './representanteLegal.routes'
import authRoutes from './auth.routes'

// Define rutas para cada módulo
router.use('/tipo-establecimientos', tipoEstablecimientoRoutes)
router.use('/tipo-documentos', tipoDocumentoRoutes)
router.use('/tipo-descanso-medicos', tipoDescansoMedicoRoutes)
router.use('/tipo-contingencias', tipoContingenciaRoutes)
router.use('/areas', areaRoutes)
router.use('/cargos', cargoRoutes)
router.use('/sedes', sedeRoutes)
router.use('/perfiles', perfilRoutes)
router.use('/personas', personaRoutes)
router.use('/empresas', empresaRoutes)
router.use('/diagnosticos', diagnosticoRoutes)
router.use('/establecimientos', establecimientoRoutes)
router.use('/trab-sociales', trabajadorSocialRoutes)
router.use('/colaboradores', colaboradorRoutes)
router.use('/usuarios', usuarioRoutes)
router.use('/descansos', descansoMedicoRoutes)
router.use('/canjes', canjeRoutes)
router.use('/reembolsos', reembolsoRoutes)
router.use('/cobros', cobroRoutes)
router.use('/documentos-tipo-contingencia', documentoTipoContRoutes)
router.use('/tipo-adjuntos', tipoAdjuntoRoutes)
router.use('/adjuntos', adjuntoRoutes)
router.use('/representantes', representanteLegalRoutes)
router.use('/auth', authRoutes)

export default router