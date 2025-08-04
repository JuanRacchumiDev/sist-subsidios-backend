import { Router } from 'express'
import CargoController from "../controllers/CargoController";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Cargos
 *   description: API para gestionar cargos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cargo:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para el cargo (UUIDv4)
 *           readOnly: true
 *         nombre:
 *           type: string
 *           description: Nombre del cargo
 *           example: Administrador
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre del cargo
 *           readOnly: true
 *           example: administrador
 *         sistema:
 *           type: boolean
 *           description: Indica si el cargo es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual del cargo (activo/inactivo)
 *           example: true
 *     CargoResponse:
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
 * /api/v1/cargos:
 *   get:
 *     summary: Obtiene un listado de todos los cargos. Opcionalmente filtrado por estado.
 *     tags: [Cargos]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar los cargos por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de cargos
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/CargoResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', CargoController.getAllCargos)

/**
 * @swagger
 * /api/v1/cargos/{id}:
 *   get:
 *     summary: Obtiene un único cargo por su ID
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del cargo a obtener
 *     responses:
 *       200:
 *         description: La descripción del cargo por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/CargoResponse'
 *       404:
 *         description: El cargo no fue encontrada
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
router.get('/:id', CargoController.getCargoById)

/**
 * @swagger
 * /api/v1/cargos/by-nombre:
 *   get:
 *     summary: Obtiene un único cargo por su nombre.
 *     tags: [Cargos]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre del cargo a obtener
 *     responses:
 *       200:
 *         description: La descripción del cargo por nombre
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/CargoResponse'
 *       400:
 *         description: Bad request, name parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cargo no encontrado.
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
router.get('/by-nombre', CargoController.getCargoByNombre)

/**
 * @swagger
 * /api/v1/cargos:
 *   post:
 *     summary: Crea un nuevo cargo.
 *     tags: [Cargos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Cargo'
 *     responses:
 *       201:
 *         description: Cargo creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/CargoResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Cargo existente.
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
router.post('/', CargoController.createCargo)

/**
 * @swagger
 * /api/v1/cargos/{id}:
 *   put:
 *     summary: Actualizar un cargo existente por su UUID.
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del cargo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Cargo'
 *     responses:
 *       200:
 *         description: Cargo actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/CargoResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cargo no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Cargo ya existente.
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
router.put('/:id', CargoController.updateCargo)

/**
 * @swagger
 * /api/v1/cargos/{id}:
 *   delete:
 *     summary: Elimina un cargo por su UUID (soft delete).
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del cargo a eliminar.
 *     responses:
 *       200:
 *         description: Cargo eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/CargoResponse'
 *       404:
 *         description: Cargo no encontrado.
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
router.delete('/:id', CargoController.deleteCargo)

export default router