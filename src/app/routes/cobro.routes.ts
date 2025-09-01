import { Router } from 'express'
import CobroController from "../controllers/CobroController";
import { authToken } from '../middlewares/authMiddleware'
import { upload } from '../../config/multer';

const router = Router()

router.get('/paginate', authToken, CobroController.getAllCobrosPaginated)

router.get('/', authToken, CobroController.getAllCobros)

router.get('/:id', authToken, CobroController.getCobroById)

router.post('/', authToken, upload.single('file'), CobroController.createCobro)

router.patch('/:id', authToken, CobroController.updateCobro)

router.delete('/:id', authToken, CobroController.deleteCobro)

export default router