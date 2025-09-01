import { Router } from 'express'
import DiagnosticoController from "../controllers/DiagnosticoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authToken, DiagnosticoController.getAllDiagnosticos)

router.get('/:codigo', authToken, DiagnosticoController.getDiagnosticoByCodigo)

router.post('/', authToken, DiagnosticoController.createDiagnostico)

router.patch('/:codigo', authToken, DiagnosticoController.updateDiagnostico)

export default router