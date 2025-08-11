import { Router } from 'express'
import DescansoMedicoController from "../controllers/DescansoMedicoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authToken, DescansoMedicoController.getAllDescansos)

router.get('/:id', authToken, DescansoMedicoController.getDescansoById)

router.post('/', authToken, DescansoMedicoController.createDescanso)

router.put('/:id', authToken, DescansoMedicoController.updateDescanso)

export default router