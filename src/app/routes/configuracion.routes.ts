import { Router } from "express"
import ConfiguracionController from "../controllers/ConfiguracionController"
import { authToken } from "../middlewares/authMiddleware"

const router = Router()

router.get('/', authToken, ConfiguracionController.getAllConfiguraciones)

router.get('/paginate', authToken, ConfiguracionController.getAllConfiguracionesPaginated)

router.get('/:id', authToken, ConfiguracionController.getConfiguracionById)

router.post('/', authToken, ConfiguracionController.createConfiguracion)

router.patch('/:id', authToken, ConfiguracionController.updateConfiguracion)

export default router