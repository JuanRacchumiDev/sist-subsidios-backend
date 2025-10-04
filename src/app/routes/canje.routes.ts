import { Router } from 'express'
import CanjeController from "../controllers/CanjeController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

// 1. Reporte de 90 días no consecutivos
router.get('/reportes/subsidios', CanjeController.getAllForReport);
// URL de ejemplo: /api/v1/reportes/subsidios/90-no-consecutivos?type=non_consecutive&limit=90&output=excel

// 2. Reporte de 150 días consecutivos
// router.get('/reportes/subsidios', CanjeController.getAllForReport);
// URL de ejemplo: /api/v1/reportes/subsidios/150-consecutivos?type=consecutive&limit=150&output=excel

// 3. Reporte de 340 días (global)
// router.get('/reportes/subsidios', CanjeController.getAllForReport);
// URL de ejemplo: /api/v1/reportes/subsidios/340-global?type=global&limit=340&output=excel

router.get('/paginate', authToken, CanjeController.getAllCanjesPaginated)

router.get('/', authToken, CanjeController.getAllCanjes)

router.get('/:id', authToken, CanjeController.getCanjeById)

router.post('/', authToken, CanjeController.createCanje)

router.patch('/:id', authToken, CanjeController.updateCanje)

export default router