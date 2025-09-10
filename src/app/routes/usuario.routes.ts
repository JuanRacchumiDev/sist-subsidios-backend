import { Router } from 'express'
import UsuarioController from "../controllers/UsuarioController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, UsuarioController.getAllUsuariosPaginated)

router.get('/', authToken, UsuarioController.getAllUsuarios)

router.get('/:id', authToken, UsuarioController.getUsuarioById)

router.post('/', authToken, UsuarioController.createUsuario)

router.patch('/:id', authToken, UsuarioController.updateUsuario)

export default router