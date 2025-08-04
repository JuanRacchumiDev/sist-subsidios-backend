import { Router } from 'express'
import TipoDocumentoController from "../controllers/TipoDocumentoController";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: TipoDocumentos
 *   description: API para gestionar tipo de documentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoDocumento:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para el tipo de documento (UUIDv4)
 *           readOnly: true
 *         nombre:
 *           type: string
 *           description: Nombre del tipo de documento
 *           example: Documento Nacional de Identidad
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre del tipo de documento
 *           readOnly: true
 *           example: documento-nacional-de-identidad
 *         abreviatura:
 *           type: string
 *           description: Abreviatura del tipo de documento
 *           example: dni
 *         longitud:
 *           type: number
 *           description: Longitud del tipo de documento
 *           example: 8
 *         en_persona:
 *           type: boolean
 *           description: Define si un tipo de documento es aplicable a una persona
 *           example: true
 *         en_empresa:
 *           type: boolean
 *           description: Define si un tipo de documento es aplicable a una empresa
 *           example: false
 *         compra:
 *           type: boolean
 *           description: Define si un tipo de documento es aplicable a una compra
 *           example: false
 *         venta:
 *           type: boolean
 *           description: Define si un tipo de documento es aplicable a una venta
 *           example: false
 *         sistema:
 *           type: boolean
 *           description: Indica si El tipo de documento es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual del tipo de documento (activo/inactivo)
 *           example: true
 *     TipoDocumentoResponse:
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
 * /api/v1/tipo-documentos:
 *   get:
 *     summary: Obtiene un listado de todos los tipo de documentos. Opcionalmente filtrado por estado.
 *     tags: [TipoDocumentos]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar los tipo de documentos por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de tipo de documentos
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDocumentoResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', TipoDocumentoController.getAllTipoDocumentos)

/**
 * @swagger
 * /api/v1/tipo-documentos/{id}:
 *   get:
 *     summary: Obtiene un único tipo de documento por su ID
 *     tags: [TipoDocumentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de documento a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de documento por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDocumentoResponse'
 *       404:
 *         description: El tipo de documento no fue encontrado
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
router.get('/:id', TipoDocumentoController.getTipoDocumentoById)

/**
 * @swagger
 * /api/v1/tipo-documentos/nombre/{nombre}:
 *   get:
 *     summary: Obtiene un único tipo de documento por su nombre.
 *     tags: [TipoDocumentos]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre del tipo de documento a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de documento por nombre
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDocumentoResponse'
 *       400:
 *         description: Bad request, name parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de documento no encontrado.
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
router.get('/nombre/:nombre', TipoDocumentoController.getTipoDocumentoByNombre)

/**
 * @swagger
 * /api/v1/tipo-documentos/abreviatura/{abreviatura}:
 *   get:
 *     summary: Obtiene un único tipo de documento por su abreviatura.
 *     tags: [TipoDocumentos]
 *     parameters:
 *       - in: query
 *         name: abreviatura
 *         required: true
 *         schema:
 *           type: string
 *           description: Abreviatura del tipo de documento a obtener
 *     responses:
 *       200:
 *         description: La descripción del tipo de documento por abreviatura
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDocumentoResponse'
 *       400:
 *         description: Bad request, abreviatura parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de documento no encontrado.
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
router.get('/abreviatura/:abreviatura', TipoDocumentoController.getTipoDocumentoByAbreviatura)

/**
 * @swagger
 * /api/v1/tipo-documentos:
 *   post:
 *     summary: Crea un nuevo tipo de documento.
 *     tags: [TipoDocumentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TipoDocumento'
 *     responses:
 *       201:
 *         description: Tipo de documento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDocumentoResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de documento existente.
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
router.post('/', TipoDocumentoController.createTipoDocumento)

/**
 * @swagger
 * /api/v1/tipo-documentos/{id}:
 *   put:
 *     summary: Actualizar un tipo de documento existente por su UUID.
 *     tags: [TipoDocumentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de documento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/TipoDocumento'
 *     responses:
 *       200:
 *         description: Tipo de documento actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDocumentoResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de documento no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de documento ya existente.
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
router.put('/:id', TipoDocumentoController.updateTipoDocumento)

/**
 * @swagger
 * /api/v1/tipo-documentos/{id}:
 *   delete:
 *     summary: Elimina un tipo de documento por su UUID (soft delete).
 *     tags: [TipoDocumentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del tipo de documento a eliminar.
 *     responses:
 *       200:
 *         description: Tipo de documento eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/TipoDocumentoResponse'
 *       404:
 *         description: Tipo de documento no encontrado.
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
router.delete('/:id', TipoDocumentoController.deleteTipoDocumento)

export default router