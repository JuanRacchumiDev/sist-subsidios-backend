import { Router } from 'express'
import ReembolsoController from "../controllers/ReembolsoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, ReembolsoController.getAllReembolsosPaginated)

router.get('/', authToken, ReembolsoController.getAllReembolsos)

router.get('/:id', authToken, ReembolsoController.getReembolsoById)

router.post('/', authToken, ReembolsoController.createReembolso)

// router.patch('/:id', authToken, ReembolsoController.updateCanje)

export default router