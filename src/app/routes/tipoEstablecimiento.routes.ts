import { Router } from 'express'
import TipoEstablecimientoController from "../controllers/TipoEstablecimientoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar', authToken, TipoEstablecimientoController.getTipoEstablecimientoByNombre)

router.get('/', authToken, TipoEstablecimientoController.getAllTipoEstablecimientos)

router.get('/:id', authToken, TipoEstablecimientoController.getTipoEstablecimientoById)

router.post('/', authToken, TipoEstablecimientoController.createTipoEstablecimiento)

router.patch('/:id', authToken, TipoEstablecimientoController.updateTipoEstablecimiento)

router.delete('/:id', authToken, TipoEstablecimientoController.deleteTipoEstablecimiento)

export default router