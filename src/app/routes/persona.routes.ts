import { Router } from 'express'
import PersonaController from "../controllers/PersonaController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar-por-tipodoc-numdoc', authToken, PersonaController.getPersonaByIdTipoDocAndNumDoc)

router.get('/consulta-api', authToken, PersonaController.getPersonaByApi)

router.get('/', authToken, PersonaController.getAllPersonas)

router.get('/:id', authToken, PersonaController.getPersonaById)

router.post('/', authToken, PersonaController.createPersona)

router.patch('/:id', authToken, PersonaController.updatePersona)

export default router