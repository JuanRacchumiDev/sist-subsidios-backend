import { Router } from 'express'
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
import trabajadorSocialRoutes from './trabajadorSocial.routes'
import colaboradorRoutes from './colaborador.routes'

const router = Router()

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
router.use('/trab-sociales', trabajadorSocialRoutes)
router.use('/colaboradores', colaboradorRoutes)

export default router