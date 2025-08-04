import { Router } from 'express'
import AreaController from "../controllers/AreaController";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: API para gestionar áreas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para el área (UUIDv4)
 *           readOnly: true
 *         nombre:
 *           type: string
 *           description: Nombre del área
 *           example: Recursos Humanos
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre del área
 *           readOnly: true
 *           example: recursos-humanos
 *         sistema:
 *           type: boolean
 *           description: Indica si el área es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual del área (activo/inactivo)
 *           example: true
 *     AreaResponse:
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
 * /api/v1/areas:
 *   get:
 *     summary: Obtiene un listado de todas las áreas. Opcionalmente filtrado por estado.
 *     tags: [Areas]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar las áreas por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de áreas
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/AreaResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', AreaController.getAllAreas)

/**
 * @swagger
 * /api/v1/areas/{id}:
 *   get:
 *     summary: Obtiene una única área por su ID
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del área a obtener
 *     responses:
 *       200:
 *         description: La descripción del área por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/AreaResponse'
 *       404:
 *         description: El área no fue encontrada
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
router.get('/:id', AreaController.getAreaById)

/**
 * @swagger
 * /api/v1/areas/by-nombre:
 *   get:
 *     summary: Obtiene una única área por su nombre.
 *     tags: [Areas]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre del área a obtener
 *     responses:
 *       200:
 *         description: La descripción del área por nombre
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/AreaResponse'
 *       400:
 *         description: Bad request, name parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Área no encontrada.
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
router.get('/by-nombre', AreaController.getAreaByNombre)

/**
 * @swagger
 * /api/v1/areas:
 *   post:
 *     summary: Crea una nueva área.
 *     tags: [Areas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Area'
 *     responses:
 *       201:
 *         description: Área creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/AreaResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Área existente.
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
router.post('/', AreaController.createArea)

/**
 * @swagger
 * /api/v1/areas/{id}:
 *   put:
 *     summary: Actualizar una área existente por su UUID.
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del área a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Area'
 *     responses:
 *       200:
 *         description: Área actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/AreaResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Área no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Área ya existente.
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
router.put('/:id', AreaController.updateArea)

/**
 * @swagger
 * /api/v1/areas/{id}:
 *   delete:
 *     summary: Elimina un área por su UUID (soft delete).
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del área a eliminar.
 *     responses:
 *       200:
 *         description: Área eliminada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/AreaResponse'
 *       404:
 *         description: Área no encontrada.
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
router.delete('/:id', AreaController.deleteArea)

export default router