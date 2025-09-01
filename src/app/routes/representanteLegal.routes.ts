import { Router } from 'express'
import RepresentanteLegalController from "../controllers/RepresentanteLegalController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar-por-tipodoc-numdoc', authToken, RepresentanteLegalController.getRepresentanteByIdTipoDocAndNumDoc)

router.get('/', authToken, RepresentanteLegalController.getRepresentantes)

router.get('/:id', authToken, RepresentanteLegalController.getRepresentanteById)

router.post('/', authToken, RepresentanteLegalController.createRepresentante)

router.patch('/:id', authToken, RepresentanteLegalController.updateRepresentante)

router.delete('/:id', authToken, RepresentanteLegalController.deleteRepresentante)

export default router