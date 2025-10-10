import { Router } from 'express'
import CargoController from "../controllers/CargoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, CargoController.getAllCargosPaginated)

router.get('/buscar', authToken, CargoController.getCargoByNombre)

router.get('/', authToken, CargoController.getAllCargos)

router.get('/:id', authToken, CargoController.getCargoById)

router.post('/', authToken, CargoController.createCargo)

router.patch('/:id', authToken, CargoController.updateCargo)

router.patch('/update-estado/:id', authToken, CargoController.updateEstado)

router.delete('/:id', authToken, CargoController.deleteCargo)

export default router