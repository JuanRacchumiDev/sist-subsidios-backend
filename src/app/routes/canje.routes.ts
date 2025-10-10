import { Router } from 'express'
import CanjeController from "../controllers/CanjeController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

// 1. Reporte de 90 días no consecutivos
router.get('/reportes/subsidios', CanjeController.getAllForReport);

router.get('/paginate', authToken, CanjeController.getAllCanjesPaginated)

router.get('/', authToken, CanjeController.getAllCanjes)

router.get('/:id', authToken, CanjeController.getCanjeById)

router.post('/', authToken, CanjeController.createCanje)

router.patch('/:id', authToken, CanjeController.updateCanje)

export default router