import { Router } from 'express'
import TipoContingenciaController from "../controllers/TipoContingenciaController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar', authToken, TipoContingenciaController.getTipoContingenciaByNombre)

router.get('/', authToken, TipoContingenciaController.getAllTipoContingencias)

router.get('/:id', authToken, TipoContingenciaController.getTipoContingenciaById)

router.post('/', authToken, TipoContingenciaController.createTipoContingencia)

router.patch('/:id', authToken, TipoContingenciaController.updateTipoContingencia)

router.delete('/:id', authToken, TipoContingenciaController.deleteTipoContingencia)

export default router