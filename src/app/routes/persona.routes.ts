import { Router } from 'express'
import PersonaController from "../controllers/PersonaController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Personas
 *   description: API para gestionar personas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para la persona (UUIDv4)
 *           readOnly: true
 *         id_tipodocumento:
 *           type: string
 *           format: 'uuid'
 *           description: Define un tipo de documento
 *         numero_documento:
 *           type: string
 *           description: Define un número de documento para una persona
 *           example: 44002211
 *         nombres:
 *           type: string
 *           description: Nombres de la persona
 *           example: Juan José
 *         apellido_paterno:
 *           type: string
 *           description: Apellido paterno de la persona
 *           example: Pérez
 *         apellido_materno:
 *           type: string
 *           description: Apellido materno de la persona
 *           example: Pérez
 *         nombre_completo:
 *           type: string
 *           description: Nombre completo de la persona
 *           example: Juan José Pérez Pérez
 *         departamento:
 *           type: string
 *           description: Departamento donde habita la persona
 *           example: Lambayeque
 *         provincia:
 *           type: string   
 *           description: Provincia donde habita la persona
 *           example: Chiclayo
 *         distrito:
 *           type: string
 *           description: Distrito donde habita la persona
 *           example: Chiclayo
 *         direccion:
 *           type: string
 *           description: Dirección donde habita la persona
 *           example: Calle Miraflores 203 - Urb. Primavera
 *         direccion_completa:
 *           type: string
 *           description: Dirección completa donde habita la persona
 *           example: Calle Miraflores 203 - Urb. Primavera - Chiclayo - Chiclayo - Lambayeque
 *         ubigeo_reniec:
 *           type: string
 *           description: Código de referencia de ubicación de la persona
 *           example: 025632
 *         ubigeo_sunat:
 *           type: string
 *           description: Código de referencia de ubicación de la persona en SUNAT
 *         ubigeo:
 *           type: string
 *           description: Código de referencia de la persona
 *         fecha_nacimiento:
 *           type: string
 *           description: Fecha de nacimiento de la persona
 *           format: 'dd-mm-YYYY'
 *           example: 21-04-1987
 *         estado_civil:
 *           type: string
 *           description: Define el estado civil de la persona
 *           example: SOLTERO
 *         foto:
 *           type: string
 *           description: Identifica la foto de la persona
 *         sexo:
 *           type: string
 *           description: Identifica el sexo de la persona
 *           example: M
 *         origen:
 *           type: string
 *           description: Identifica el origen del registro de la persona
 *           example: WEB | APP | SISTEMA
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre de la persona
 *           readOnly: true
 *           example: miraflores
 *         sistema:
 *           type: boolean
 *           description: Indica si la persona es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual de la persona (activo/inactivo)
 *           example: true
 *     PersonaResponse:
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

router.get('/buscar-por-tipodoc-numdoc', authToken, PersonaController.getPersonaByIdTipoDocAndNumDoc)

/**
 * @swagger
 * /api/v1/personas/consulta-api:
 *   get:
 *     summary: Obtiene una única persona obtenido desde la API
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: abreviatura
 *         required: true
 *         schema:
 *           type: string
 *           description: Abreviatura de la persona a obtener
 *     responses:
 *       200:
 *         description: La descripción de la persona por abreviatura y número de documento
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PersonaResponse'
 *       404:
 *         description: la persona no fue encontrada
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
router.get('/consulta-api', authToken, PersonaController.getPersonaByApi)

/**
 * @swagger
 * /api/v1/personas:
 *   get:
 *     summary: Obtiene un listado de todas las personas.
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Un listado de personas
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PersonaResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authToken, PersonaController.getAllPersonas)

/**
 * @swagger
 * /api/v1/personas/{id}:
 *   get:
 *     summary: Obtiene una única persona por su ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID de la persona a obtener
 *     responses:
 *       200:
 *         description: La descripción de la persona por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PersonaResponse'
 *       404:
 *         description: la persona no fue encontrada
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
router.get('/:id', authToken, PersonaController.getPersonaById)

/**
 * @swagger
 * /api/v1/personas:
 *   post:
 *     summary: Crea una nueva persona.
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Persona'
 *     responses:
 *       201:
 *         description: Persona creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PersonaResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Persona existente.
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
router.post('/', authToken, PersonaController.createPersona)

/**
 * @swagger
 * /api/v1/personas/{id}:
 *   put:
 *     summary: Actualizar una persona existente por su UUID.
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID de la persona a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Persona'
 *     responses:
 *       200:
 *         description: Persona actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PersonaResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Persona no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Persona ya existente.
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
router.patch('/:id', authToken, PersonaController.updatePersona)

export default router