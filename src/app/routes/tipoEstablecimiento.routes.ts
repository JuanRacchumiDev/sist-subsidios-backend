import { Router } from 'express'
import TipoEstablecimientoController from "../controllers/TipoEstablecimientoController";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: TipoEstablecimientos
 *   description: API para gestionar tipo de establecimientos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoEstablecimiento:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para el tipo de establecimiento (UUIDv4)
 *           readOnly: true
 *         nombre:
 *           type: string
 *           description: Nombre del tipo de establecimiento
 *           example: Centro de salud
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre del tipo de establecimiento
 *           readOnly: true
 *           example: centro-de-salud
 *         sistema:
 *           type: boolean
 *           description: Indica si el área es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual del tipo de establecimiento (activo/inactivo)
 *           example: true
 *     TipoEstablecimientoResponse:
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
 * /api/v1/tipo-establecimientos:
 *   get:
 *     summary: Obtiene un listado de todos los tipo de establecimientos. Opcionalmente filtrado por estado.
 *     tags: [TipoEstablecimientos]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar las tipo de establecimientos por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de tipo de establecimientos
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoEstablecimientoResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', TipoEstablecimientoController.getAllTipoEstablecimientos)

/**
 * @swagger
 * /api/v1/tipo-establecimientos/{id}:
 *   get:
 *     summary: Obtiene un único tipo de establecimiento por su ID
 *     tags: [TipoEstablecimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de establecimiento a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de establecimiento por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoEstablecimientoResponse'
 *       404:
 *         description: El tipo de establecimiento no fue encontrado
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
router.get('/:id', TipoEstablecimientoController.getTipoEstablecimientoById)

/**
 * @swagger
 * /api/v1/tipo-establecimientos/by-nombre:
 *   get:
 *     summary: Obtiene un único tipo de establecimiento por su nombre.
 *     tags: [TipoEstablecimientos]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre del tipo de establecimiento a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de establecimiento por nombre
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoEstablecimientoResponse'
 *       400:
 *         description: Bad request, name parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de establecimiento no encontrado.
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
router.get('/by-nombre', TipoEstablecimientoController.getTipoEstablecimientoByNombre)

/**
 * @swagger
 * /api/v1/tipo-establecimientos:
 *   post:
 *     summary: Crea un nuevo tipo de establecimiento.
 *     tags: [TipoEstablecimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TipoEstablecimiento'
 *     responses:
 *       201:
 *         description: Tipo de establecimiento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoEstablecimientoResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de establecimiento existente.
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
router.post('/', TipoEstablecimientoController.createTipoEstablecimiento)

/**
 * @swagger
 * /api/v1/tipo-establecimientos/{id}:
 *   put:
 *     summary: Actualizar un tipo de establecimiento existente por su UUID.
 *     tags: [TipoEstablecimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de establecimiento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TipoEstablecimiento'
 *     responses:
 *       200:
 *         description: Tipo de establecimiento actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoEstablecimientoResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de establecimiento no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de establecimiento ya existente.
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
router.put('/:id', TipoEstablecimientoController.updateTipoEstablecimiento)

/**
 * @swagger
 * /api/v1/tipo-establecimientos/{id}:
 *   delete:
 *     summary: Elimina un tipo de establecimiento por su UUID (soft delete).
 *     tags: [TipoEstablecimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de establecimiento a eliminar.
 *     responses:
 *       200:
 *         description: Tipo de establecimiento eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoEstablecimientoResponse'
 *       404:
 *         description: Tipo de establecimiento no encontrado.
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
router.delete('/:id', TipoEstablecimientoController.deleteTipoEstablecimiento)

export default router