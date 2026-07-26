import { Router } from 'express'
import DiagnosticoController from "../controllers/DiagnosticoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, DiagnosticoController.getAllDiagnosticosPaginated)

router.get('/', authToken, DiagnosticoController.getAllDiagnosticos)

router.get('/:codigo', authToken, DiagnosticoController.getDiagnosticoByCodigo)

router.post('/', authToken, DiagnosticoController.createDiagnostico)

router.patch('/:codigo', authToken, DiagnosticoController.updateDiagnostico)

router.patch('/update-estado/:codigo', authToken, DiagnosticoController.updateEstado)

router.delete('/:codigo', authToken, DiagnosticoController.deleteDiagnostico)

export default router