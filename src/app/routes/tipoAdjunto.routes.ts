import { Router } from 'express'
import TipoAdjuntoController from "../controllers/TipoAdjuntoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar', TipoAdjuntoController.getTipoAdjuntoByNombre)

router.get('/', authToken, TipoAdjuntoController.getAllTipoAdjuntos)

router.get('/:id', authToken, TipoAdjuntoController.getTipoAdjuntoById)

router.post('/', authToken, TipoAdjuntoController.createTipoAjunto)

router.patch('/:id', authToken, TipoAdjuntoController.updateTipoAjunto)

export default router