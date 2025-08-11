import { Router } from 'express'
import CanjeController from "../controllers/CanjeController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authToken, CanjeController.getAllCanjes)

router.get('/:id', authToken, CanjeController.getCanjeById)

router.post('/', authToken, CanjeController.createCanje)

router.put('/:id', authToken, CanjeController.updateCanje)

export default router