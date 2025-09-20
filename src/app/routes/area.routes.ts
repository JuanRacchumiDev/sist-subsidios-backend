import { Router } from 'express'
import AreaController from "../controllers/AreaController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, AreaController.getAllAreasPaginated)

router.get('/buscar', authToken, AreaController.getAreaByNombre)

router.get('/', authToken, AreaController.getAllAreas)

router.get('/:id', authToken, AreaController.getAreaById)

router.post('/', authToken, AreaController.createArea)

router.patch('/:id', authToken, AreaController.updateArea)

router.delete('/:id', authToken, AreaController.deleteArea)

export default router