import { Router } from 'express'
import DocumentoTipoContController from "../controllers/DocumentoTipoContController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, DocumentoTipoContController.getAllDocumentosPaginated)

router.get('/', authToken, DocumentoTipoContController.getAllDocumentos)

router.get('/:id', authToken, DocumentoTipoContController.getDocumentoById)

router.post('/', authToken, DocumentoTipoContController.createDocumento)

router.patch('/:id', authToken, DocumentoTipoContController.updateDocumento)

export default router