import { Router } from 'express'
import TipoDocumentoController from "../controllers/TipoDocumentoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar', authToken, TipoDocumentoController.getTipoDocumentoBySearch)

router.get('/', authToken, TipoDocumentoController.getAllTipoDocumentos)

router.get('/:id', authToken, TipoDocumentoController.getTipoDocumentoById)

router.post('/', authToken, TipoDocumentoController.createTipoDocumento)

router.patch('/:id', authToken, TipoDocumentoController.updateTipoDocumento)

router.delete('/:id', authToken, TipoDocumentoController.deleteTipoDocumento)

export default router