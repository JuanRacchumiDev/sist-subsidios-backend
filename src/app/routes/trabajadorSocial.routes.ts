import { Router } from 'express'
import TrabajadorSocialController from "../controllers/TrabajadorSocialController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/buscar-por-tipodoc-numdoc', authToken, TrabajadorSocialController.getTrabajadorSocialByIdTipoDocAndNumDoc)

router.get('/', authToken, TrabajadorSocialController.getTrabajadoresSociales)

router.get('/:id', authToken, TrabajadorSocialController.getTrabajadorSocialById)

router.post('/', authToken, TrabajadorSocialController.createTrabajadorSocial)

router.patch('/:id', authToken, TrabajadorSocialController.updateTrabajadorSocial)

router.delete('/:id', authToken, TrabajadorSocialController.deleteTrabajadorSocial)

export default router