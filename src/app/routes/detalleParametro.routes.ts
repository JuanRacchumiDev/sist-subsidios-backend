import { Router } from 'express'
import DetalleParametroController from "../controllers/DetalleParametroController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, DetalleParametroController.getAllDetallesPaginated)

// router.get('/buscar', authToken, DetalleParametroController.getDetalleByNombre)

router.get('/', authToken, DetalleParametroController.getAllDetalles)

router.get('/:id', authToken, DetalleParametroController.getDetalleById)

router.post('/', authToken, DetalleParametroController.createDetalle)

router.patch('/:id', authToken, DetalleParametroController.updateDetalle)

// router.patch('/update-estado/:id', authToken, DetalleParametroController.updateEstado)

// router.delete('/:id', authToken, DetalleParametroController.deleteDetalle)

export default router