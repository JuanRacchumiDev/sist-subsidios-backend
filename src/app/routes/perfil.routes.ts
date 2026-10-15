import { Router } from 'express'
import PerfilController from "../controllers/PerfilController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, PerfilController.getAllPerfilesPaginated)

router.get('/', authToken, PerfilController.getAllPerfiles)

router.get('/:id', authToken, PerfilController.getPerfilById)

router.get('/buscar', authToken, PerfilController.getPerfilByNombre)

router.post('/', authToken, PerfilController.createPerfil)

router.patch('/:id', authToken, PerfilController.updatePerfil)

router.delete('/:id', authToken, PerfilController.deletePerfil)

export default router