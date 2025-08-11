import { Router } from 'express'
import TipoDescansoMedicoController from "../controllers/TipoDescansoMedicoController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: TipoDescansoMedicos
 *   description: API para gestionar tipo de descanso médicos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoDescansoMedico:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para el tipo de descanso médico (UUIDv4)
 *           readOnly: true
 *         nombre:
 *           type: string
 *           description: Nombre del tipo de descanso médico
 *           example: Enfermedad común
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre del tipo de descanso médico
 *           readOnly: true
 *           example: enfermedad-comun
 *         sistema:
 *           type: boolean
 *           description: Indica si el tipo de descanso médico es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual del tipo de descanso médico (activo/inactivo)
 *           example: true
 *     TipoDescansoMedicoResponse:
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
 * /api/v1/tipo-descanso-medicos:
 *   get:
 *     summary: Obtiene un listado de todos los tipo de descanso médicos. Opcionalmente filtrado por estado.
 *     tags: [TipoDescansoMedicos]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar los tipo de descanso médicos por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de tipo de descanso médicos
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDescansoMedicoResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authToken, TipoDescansoMedicoController.getAllTipoDescansoMedicos)

/**
 * @swagger
 * /api/v1/tipo-descanso-medicos/{id}:
 *   get:
 *     summary: Obtiene un único tipo de descanso médico por su ID
 *     tags: [TipoDescansoMedicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de descanso médico a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de descanso médico por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDescansoMedicoResponse'
 *       404:
 *         description: El tipo de descanso médico no fue encontrada
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
router.get('/:id', authToken, TipoDescansoMedicoController.getTipoDescansoMedicoById)

/**
 * @swagger
 * /api/v1/tipo-descanso-medicos/by-nombre:
 *   get:
 *     summary: Obtiene un único tipo de descanso médico por su nombre.
 *     tags: [TipoDescansoMedicos]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre del tipo de descanso médico a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de descanso médico por nombre
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDescansoMedicoResponse'
 *       400:
 *         description: Bad request, name parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de descanso médico no encontrado.
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
router.get('/by-nombre', authToken, TipoDescansoMedicoController.getTipoDescansoMedicoByNombre)

/**
 * @swagger
 * /api/v1/tipo-descanso-medicos:
 *   post:
 *     summary: Crea un nuevo tipo de descanso médico.
 *     tags: [TipoDescansoMedicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TipoDescansoMedico'
 *     responses:
 *       201:
 *         description: Tipo de descanso médico creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDescansoMedicoResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de descanso médico existente.
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
router.post('/', authToken, TipoDescansoMedicoController.createTipoDescansoMedico)

/**
 * @swagger
 * /api/v1/tipo-descanso-medicos/{id}:
 *   put:
 *     summary: Actualizar un Tipo de descanso médico existente por su UUID.
 *     tags: [TipoDescansoMedicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de descanso médico a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TipoDescansoMedico'
 *     responses:
 *       200:
 *         description: Tipo de descanso médico actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDescansoMedicoResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de descanso médico no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de descanso médico ya existente.
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
router.put('/:id', authToken, TipoDescansoMedicoController.updateTipoDescansoMedico)

/**
 * @swagger
 * /api/v1/tipo-descanso-medicos/{id}:
 *   delete:
 *     summary: Elimina un tipo de descanso médico por su UUID (soft delete).
 *     tags: [TipoDescansoMedicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de descanso médico a eliminar.
 *     responses:
 *       200:
 *         description: Tipo de descanso médico eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDescansoMedicoResponse'
 *       404:
 *         description: Tipo de descanso médico no encontrado.
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
router.delete('/:id', authToken, TipoDescansoMedicoController.deleteTipoDescansoMedico)

export default router