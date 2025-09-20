import { Router } from 'express'
import SedeController from "../controllers/SedeController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar', authToken, SedeController.getSedeByNombre)

router.get('/', authToken, SedeController.getAllSedes)

router.get('/:id', authToken, SedeController.getSedeById)

router.post('/', authToken, SedeController.createSede)

router.patch('/:id', authToken, SedeController.updateSede)

router.delete('/:id', authToken, SedeController.deleteSede)

export default router