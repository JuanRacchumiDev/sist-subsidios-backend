import { Router } from 'express'
import DocumentoController from "../controllers/DocumentoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authToken, DocumentoController.getAllDocumentos)

router.get('/:id', authToken, DocumentoController.getDocumentoById)

router.post('/', authToken, DocumentoController.createDocumento)

router.patch('/:id', authToken, DocumentoController.updateDocumento)

export default router