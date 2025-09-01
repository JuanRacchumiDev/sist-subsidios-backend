import { Router } from 'express'
import AdjuntoController from "../controllers/AdjuntoController";
import { authToken } from '../middlewares/authMiddleware'
import { upload } from '../../config/multer';

const router = Router()

router.get('/paginate', authToken, AdjuntoController.getAllAdjuntosPaginated)

router.get('/', authToken, AdjuntoController.getAllAdjuntos)

router.get('/:id', authToken, AdjuntoController.getAdjuntoById)

router.post('/', authToken, upload.single('file'), AdjuntoController.createAdjunto)

router.patch('/:id', authToken, AdjuntoController.updateAdjunto)

router.delete('/:id', authToken, AdjuntoController.deleteAdjunto)

export default router