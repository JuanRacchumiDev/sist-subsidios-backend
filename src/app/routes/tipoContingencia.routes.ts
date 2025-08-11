import { Router } from 'express'
import TipoContingenciaController from "../controllers/TipoContingenciaController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: TipoContingencias
 *   description: API para gestionar tipo de contingencias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoContingencia:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para el tipo de contingencia (UUIDv4)
 *           readOnly: true
 *         nombre:
 *           type: string
 *           description: Nombre del tipo de contingencia
 *           example: ESSALUD
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre del tipo de contingencia
 *           readOnly: true
 *           example: essalud
 *         sistema:
 *           type: boolean
 *           description: Indica si el tipo de contingencia es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual del tipo de contingencia (activo/inactivo)
 *           example: true
 *     TipoContingenciaResponse:
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
 * /api/v1/tipo-contingencias:
 *   get:
 *     summary: Obtiene un listado de todos los tipo de contingencias. Opcionalmente filtrado por estado.
 *     tags: [TipoContingencias]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar los tipo de contingencias por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de tipo de contingencias
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoContingenciaResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authToken, TipoContingenciaController.getAllTipoContingencias)

/**
 * @swagger
 * /api/v1/tipo-contingencias/{id}:
 *   get:
 *     summary: Obtiene un único tipo de contingencia por su ID
 *     tags: [TipoContingencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de contingencia a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de contingencia por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoContingenciaResponse'
 *       404:
 *         description: El tipo de contingencia no fue encontrado
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
router.get('/:id', authToken, TipoContingenciaController.getTipoContingenciaById)

/**
 * @swagger
 * /api/v1/tipo-contingencias/by-nombre:
 *   get:
 *     summary: Obtiene un único tipo de contingencia por su nombre.
 *     tags: [TipoContingencias]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre del tipo de contingencia a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de contingencia por nombre
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoContingenciaResponse'
 *       400:
 *         description: Bad request, name parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de contingencia no encontrado.
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
router.get('/by-nombre', authToken, TipoContingenciaController.getTipoContingenciaByNombre)

/**
 * @swagger
 * /api/v1/tipo-contingencias:
 *   post:
 *     summary: Crea un nuevo tipo de contingencia.
 *     tags: [TipoContingencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TipoContingencia'
 *     responses:
 *       201:
 *         description: Tipo de contingencia creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoContingenciaResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de contingencia existente.
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
router.post('/', authToken, TipoContingenciaController.createTipoContingencia)

/**
 * @swagger
 * /api/v1/tipo-contingencias/{id}:
 *   put:
 *     summary: Actualizar un tipo de contingencia existente por su UUID.
 *     tags: [TipoContingencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de contingencia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TipoContingencia'
 *     responses:
 *       200:
 *         description: Tipo de contingencia actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoContingenciaResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de contingencia no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de contingencia ya existente.
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
router.put('/:id', authToken, TipoContingenciaController.updateTipoContingencia)

/**
 * @swagger
 * /api/v1/tipo-contingencias/{id}:
 *   delete:
 *     summary: Elimina un tipo de contingencia por su UUID (soft delete).
 *     tags: [TipoContingencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de contingencia a eliminar.
 *     responses:
 *       200:
 *         description: Tipo de contingencia eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoContingenciaResponse'
 *       404:
 *         description: Tipo de contingencia no encontrado.
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
router.delete('/:id', authToken, TipoContingenciaController.deleteTipoContingencia)

export default router