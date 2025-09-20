import { Router } from 'express'
import TipoDescansoMedicoController from "../controllers/TipoDescansoMedicoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar', authToken, TipoDescansoMedicoController.getTipoDescansoMedicoByNombre)

router.get('/', authToken, TipoDescansoMedicoController.getAllTipoDescansoMedicos)

router.get('/:id', authToken, TipoDescansoMedicoController.getTipoDescansoMedicoById)

router.post('/', authToken, TipoDescansoMedicoController.createTipoDescansoMedico)

router.patch('/:id', authToken, TipoDescansoMedicoController.updateTipoDescansoMedico)

router.delete('/:id', authToken, TipoDescansoMedicoController.deleteTipoDescansoMedico)

export default router