import { Router } from 'express'
import ColaboradorController from "../controllers/ColaboradorController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, ColaboradorController.getAllColaboradoresPaginated)

router.get('/buscar-por-tipodoc-numdoc', authToken, ColaboradorController.getColaboradorByIdTipoDocAndNumDoc)

router.get('/buscar-por-empresa', authToken, ColaboradorController.getColaboradoresByIdEmpresa)

router.get('/', authToken, ColaboradorController.getColaboradores)

router.get('/:id', authToken, ColaboradorController.getColaboradorById)

router.post('/', authToken, ColaboradorController.createColaborador)

router.patch('/:id', authToken, ColaboradorController.updateColaborador)

router.patch('/update-estado/:id', authToken, ColaboradorController.updateEstado)

router.delete('/:id', authToken, ColaboradorController.deleteColaborador)

export default router