import { Router } from 'express'
import ColaboradorController from "../controllers/ColaboradorController";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Colaboradores
 *   description: API para gestionar colaboradores
 */

/**
 * @swagger
 * /api/v1/colaboradores:
 *   get:
 *     summary: Obtiene un listado de todos los colaboradores. Opcionalmente filtrado por estado.
 *     tags: [Colaboradores]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *           description: Filtrar los colaboradores por estado (true para activo, false para inactivo)
 *     responses:
 *       200:
 *         description: Un listado de colaboradores
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ColaboradorResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ColaboradorController.getColaboradores)

/**
 * @swagger
 * /api/v1/colaboradores/{id}:
 *   get:
 *     summary: Obtiene un único trabajador por su ID
 *     tags: [Colaboradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del colaborador a obtener
 *     responses:
 *       200:
 *         description: La descripción del colaborador por ID
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ColaboradorResponse'
 *       404:
 *         description: El colaborador no fue encontrado
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
router.get('/:id', ColaboradorController.getColaboradorById)

/**
 * @swagger
 * /api/v1/colaboradores:
 *   post:
 *     summary: Crea un nuevo colaborador.
 *     tags: [Colaboradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Colaborador'
 *     responses:
 *       201:
 *         description: Colaborador creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ColaboradorResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Colaborador existente.
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
router.post('/', ColaboradorController.createColaborador)

/**
 * @swagger
 * /api/v1/colaboradores/{id}:
 *   put:
 *     summary: Actualizar un colaborador existente por su UUID.
 *     tags: [Colaboradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del colaborador a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             items:
 *               $ref: '#/components/schemas/Colaborador'
 *     responses:
 *       200:
 *         description: Colaborador actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ColaboradorResponse'
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Colaborador no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *              items:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Colaborador ya existente.
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
router.put('/:id', ColaboradorController.updateColaborador)

/**
 * @swagger
 * /api/v1/colaboradores/{id}:
 *   delete:
 *     summary: Elimina un colaborador por su UUID (soft delete).
 *     tags: [Colaboradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: UUID del colaborador a eliminar.
 *     responses:
 *       200:
 *         description: Colaborador eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ColaboradorResponse'
 *       404:
 *         description: Colaborador no encontrado.
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
router.delete('/:id', ColaboradorController.deleteColaborador)

export default router