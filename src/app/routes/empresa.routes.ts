import { Router } from 'express'
import EmpresaController from "../controllers/EmpresaController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/consulta-api', authToken, EmpresaController.getEmpresaByApi)

router.get('/paginate', authToken, EmpresaController.getAllEmpresasPaginated)

router.get('/', authToken, EmpresaController.getAllEmpresas)

router.get('/:id', authToken, EmpresaController.getEmpresaById)

router.post('/', authToken, EmpresaController.createEmpresa)

router.patch('/:id', authToken, EmpresaController.updateEmpresa)

router.patch('/update-estado/:id', authToken, EmpresaController.updateEstado)

export default router