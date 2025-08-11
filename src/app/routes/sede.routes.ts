import { Router } from 'express'
import SedeController from "../controllers/SedeController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Sedes
 *   description: API para gestionar sedes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sede:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para la sede (UUIDv4)
 *           readOnly: true
 *         nombre:
 *           type: string
 *           description: Nombre de la sede
 *           example: Miraflores
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre de la sede
 *           readOnly: true
 *           example: miraflores
 *         sistema:
 *           type: boolean
 *           description: Indica si la sede es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual de la sede (activo/inactivo)
 *           example: true
 *     SedeResponse:
 *       type: object
 *       properties:
 *         result: {type: boolean, example: true}
 *         message: {type: string, example: Operación exitosa}
 *         error: {type: string, example: Error message}
 *         status: {type: number, example: 200}
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         result: {type: boolean, example: false}
 *         message: {type: string, example: Recurso no encontrado}
 *         error: {type: string, example: Detalle del error}
 *         status: {type: number, example: 404} 
 */

/**
 * @swagger
 * /api/v1/sedes:
 *   get:
 *     summary: Obtiene un listado de todas las sedes. Opcionalmente filtrado por estado.
 *     tags: [Sedes]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar las sedes por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de sedes
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/SedeResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authToken, SedeController.getAllSedes)

/**
 * @swagger
 * /api/v1/sedes/{id}:
 *   get:
 *     summary: Obtiene una única sede por su ID
 *     tags: [Sedes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID de la sede a obtener
 *     responses:
 *       200:
 *         description: La descripción de la sede por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/SedeResponse'
 *       404:
 *         description: la sede no fue encontrada
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
router.get('/:id', authToken, SedeController.getSedeById)

/**
 * @swagger
 * /api/v1/sedes/by-nombre:
 *   get:
 *     summary: Obtiene una única sede por su nombre.
 *     tags: [Sedes]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre de la sede a obtener
 *     responses:
 *       200:
 *         description: La descripción de la sede por nombre
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/SedeResponse'
 *       400:
 *         description: Bad request, name parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sede no encontrada.
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
router.get('/by-nombre', authToken, SedeController.getSedeByNombre)

/**
 * @swagger
 * /api/v1/sedes:
 *   post:
 *     summary: Crea una nueva sede.
 *     tags: [Sedes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Sede'
 *     responses:
 *       201:
 *         description: Sede creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/SedeResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Sede existente.
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
router.post('/', authToken, SedeController.createSede)

/**
 * @swagger
 * /api/v1/sedes/{id}:
 *   put:
 *     summary: Actualizar una sede existente por su UUID.
 *     tags: [Sedes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID de la sede a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Sede'
 *     responses:
 *       200:
 *         description: Sede actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/SedeResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sede no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Sede ya existente.
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
router.put('/:id', authToken, SedeController.updateSede)

/**
 * @swagger
 * /api/v1/sedes/{id}:
 *   delete:
 *     summary: Elimina una sede por su UUID (soft delete).
 *     tags: [Sedes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID de la sede a eliminar.
 *     responses:
 *       200:
 *         description: Sede eliminada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/SedeResponse'
 *       404:
 *         description: Sede no encontrada.
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
router.delete('/:id', authToken, SedeController.deleteSede)

export default router