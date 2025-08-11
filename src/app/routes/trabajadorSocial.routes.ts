import { Router } from 'express'
import TrabajadorSocialController from "../controllers/TrabajadorSocialController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: TrabajadoresSociales
 *   description: API para gestionar trabajadores sociales
 */

/**
 * @swagger
 * /api/v1/trab-sociales:
 *   get:
 *     summary: Obtiene un listado de todos los trabajadores sociales. Opcionalmente filtrado por estado.
 *     tags: [TrabajadoresSociales]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar las trabajadores sociales por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de trabajadores sociales
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TrabajadorSocialResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authToken, TrabajadorSocialController.getTrabajadoresSociales)

/**
 * @swagger
 * /api/v1/trab-sociales/{id}:
 *   get:
 *     summary: Obtiene un único trabajador social por su ID
 *     tags: [TrabajadoresSociales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del trabajador social a obtener
 *     responses:
 *       200:
 *         description: La descripción del trabajador social por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TrabajadorSocialResponse'
 *       404:
 *         description: El trabajador social no fue encontrado
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 * 
 *                 
 */
router.get('/:id', authToken, TrabajadorSocialController.getTrabajadorSocialById)

/**
 * @swagger
 * /api/v1/trab-sociales:
 *   post:
 *     summary: Crea un nuevo trabajador social.
 *     tags: [TrabajadoresSociales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TrabajadorSocial'
 *     responses:
 *       201:
 *         description: Trabajador social creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TrabajadorSocialResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Trabajdor social existente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authToken, TrabajadorSocialController.createTrabajadorSocial)

/**
 * @swagger
 * /api/v1/trab-sociales/{id}:
 *   put:
 *     summary: Actualizar un trabajador social existente por su UUID.
 *     tags: [TrabajadoresSociales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del trabajador social a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TrabajadorSocial'
 *     responses:
 *       200:
 *         description: Trabajador social actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TrabajadorSocialResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Trabajador social no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Trabajador social ya existente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authToken, TrabajadorSocialController.updateTrabajadorSocial)

/**
 * @swagger
 * /api/v1/trab-sociales/{id}:
 *   delete:
 *     summary: Elimina un trabajador social por su UUID (soft delete).
 *     tags: [TrabajadoresSociales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del trabajador social a eliminar.
 *     responses:
 *       200:
 *         description: Trabajador social eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TrabajadorSocialResponse'
 *       404:
 *         description: Trabajador social no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authToken, TrabajadorSocialController.deleteTrabajadorSocial)

export default router