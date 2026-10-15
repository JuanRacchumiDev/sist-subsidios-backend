import { Router } from 'express'
import DetalleParametroController from "../controllers/DetalleParametroController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, DetalleParametroController.getAllDetallesPaginated)

router.get('/', authToken, DetalleParametroController.getAllDetalles)

router.get('/:id', authToken, DetalleParametroController.getDetalleById)

router.post('/', authToken, DetalleParametroController.createDetalle)

router.patch('/:id', authToken, DetalleParametroController.updateDetalle)

export default router