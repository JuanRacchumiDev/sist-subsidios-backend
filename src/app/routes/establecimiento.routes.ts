import { Router } from 'express'
import EstablecimientoController from "../controllers/EstablecimientoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar-por-nombre', authToken, EstablecimientoController.getEstablecimientoByNombre)

router.get('/', authToken, EstablecimientoController.getAllEstablecimientos)

router.get('/:id', authToken, EstablecimientoController.getEstablecimientoById)

router.post('/', authToken, EstablecimientoController.createEstablecimiento)

router.patch('/:id', authToken, EstablecimientoController.updateEstablecimiento)

export default router