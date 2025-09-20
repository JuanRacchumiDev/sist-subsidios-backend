import { Router } from 'express'
import PerfilController from "../controllers/PerfilController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

router.get('/paginate', authToken, PerfilController.getAllPerfilesPaginated)

/**
 * @swagger
 * /api/v1/perfiles:
 *   get:
 *     summary: Obtiene un listado de todos los perfiles. Opcionalmente filtrado por estado.
 *     tags: [Perfiles]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar los perfiles por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de perfiles
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PerfilResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authToken, PerfilController.getAllPerfiles)

router.get('/:id', authToken, PerfilController.getPerfilById)

router.get('/buscar', authToken, PerfilController.getPerfilByNombre)

router.post('/', authToken, PerfilController.createPerfil)

router.patch('/:id', authToken, PerfilController.updatePerfil)

router.delete('/:id', authToken, PerfilController.deletePerfil)

export default router