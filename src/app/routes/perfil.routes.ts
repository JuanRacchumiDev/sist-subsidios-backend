import { Router } from 'express'
import PerfilController from "../controllers/PerfilController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Perfiles
 *   description: API para gestionar perfiles
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Perfil:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para el perfil (UUIDv4)
 *           readOnly: true
 *         nombre:
 *           type: string
 *           description: Nombre del perfil
 *           example: Asistente Social
 *         nombre_url:
 *           type: string
 *           description: Versión url amigable para el nombre del perfil
 *           readOnly: true
 *           example: asistente-social
 *         sistema:
 *           type: boolean
 *           description: Indica si el perfil es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual del perfil (activo/inactivo)
 *           example: true
 *     PerfilResponse:
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

/**
 * @swagger
 * /api/v1/perfiles/{id}:
 *   get:
 *     summary: Obtiene un único perfil por su ID
 *     tags: [Perfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del perfil a obtener
 *     responses:
 *       200:
 *         description: La descripción del perfil por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PerfilResponse'
 *       404:
 *         description: El perfil no fue encontrado
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
router.get('/:id', authToken, PerfilController.getPerfilById)

/**
 * @swagger
 * /api/v1/perfiles/by-nombre:
 *   get:
 *     summary: Obtiene un único perfil por su nombre.
 *     tags: [Perfiles]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre del perfil a obtener
 *     responses:
 *       200:
 *         description: La descripción del perfil por nombre
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PerfilResponse'
 *       400:
 *         description: Bad request, name parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Perfil no encontrado.
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
router.get('/by-nombre', authToken, PerfilController.getPerfilByNombre)

/**
 * @swagger
 * /api/v1/perfiles:
 *   post:
 *     summary: Crea un nuevo perfil.
 *     tags: [Perfiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Perfil'
 *     responses:
 *       201:
 *         description: Perfil creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PerfilResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Perfil existente.
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
router.post('/', authToken, PerfilController.createPerfil)

/**
 * @swagger
 * /api/v1/perfiles/{id}:
 *   put:
 *     summary: Actualizar un perfil existente por su UUID.
 *     tags: [Perfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del perfil a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Perfil'
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PerfilResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Perfil no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Perfil ya existente.
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
router.patch('/:id', authToken, PerfilController.updatePerfil)

/**
 * @swagger
 * /api/v1/perfiles/{id}:
 *   delete:
 *     summary: Elimina un perfil por su UUID (soft delete).
 *     tags: [Perfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del perfil a eliminar.
 *     responses:
 *       200:
 *         description: Perfil eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/PerfilResponse'
 *       404:
 *         description: Perfil no encontrado.
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
router.delete('/:id', authToken, PerfilController.deletePerfil)

export default router