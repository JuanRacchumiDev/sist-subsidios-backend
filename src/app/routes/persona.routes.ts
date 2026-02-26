import { Router } from 'express'
import PersonaController from "../controllers/PersonaController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

// router.get('/paginate', authToken, PersonaController.getAllPersonasPaginated)

router.get('/buscar-por-tipodoc-numdoc', authToken, PersonaController.getPersonaByIdTipoDocAndNumDoc)

router.get('/buscar-por-empresa-por-grupo', authToken, PersonaController.getAllPersonaByEmpresaWithGrupo)

router.get('/buscar-por-grupo/paginate', authToken, PersonaController.getPersonasByGrupoPaginated)

router.get('/consulta-api', authToken, PersonaController.getPersonaByApi)

router.get('/empresa/:idEmpresa', authToken, PersonaController.getAllPersonasByEmpresa)

router.get('/buscar-unico', authToken, PersonaController.getPersonaUnique)

router.get('/', authToken, PersonaController.getAllPersonas)

router.get('/:id', authToken, PersonaController.getPersonaById)

router.post('/', authToken, PersonaController.createPersona)

router.patch('/:id', authToken, PersonaController.updatePersona)

export default router