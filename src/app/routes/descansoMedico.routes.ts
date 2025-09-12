import { Router } from 'express'
import DescansoMedicoController from "../controllers/DescansoMedicoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/colaborador/paginate', authToken, DescansoMedicoController.getAllDescansosByColaboradorPaginated)

router.get('/paginate', authToken, DescansoMedicoController.getAllDescansosPaginated)

router.get('/', authToken, DescansoMedicoController.getAllDescansos)

router.get('/:id', authToken, DescansoMedicoController.getDescansoById)

router.post('/', authToken, DescansoMedicoController.createDescanso)

router.patch('/:id', authToken, DescansoMedicoController.updateDescanso)

export default router