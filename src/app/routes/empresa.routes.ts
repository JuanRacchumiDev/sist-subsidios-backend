import { Router } from 'express'
import EmpresaController from "../controllers/EmpresaController";
import { authToken } from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: API para gestionar empresas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Empresa:
 *       type: object
 *       required:
 *         - nombre_o_razon_social
 *       properties:
 *         id:
 *           type: string
 *           format: 'uuid'
 *           description: Identificador único para la empresa (UUIDv4)
 *           readOnly: true
 *         numero:
 *           type: string
 *           description: Define el ruc de una empresa
 *           example: 20403050607
 *         nombre_o_razon_social:
 *           type: string
 *           description: Nombre o razón social de la empresa
 *           example: EMPRESA E.I.R.L.
 *         tipo_contribuyente:
 *           type: string
 *           description: Define el tipo de empresa
 *           example: Empresa individual de Resp.Ltda
 *         estado_sunat:
 *           type: string
 *           description: Define el estado de la empresa ante SUNAT
 *           example: ACTIVO
 *         condicion_sunat:
 *           type: string
 *           description: Define la condición de la empresa ante SUNAT
 *           example: HABIDO
 *         departamento:
 *           type: string
 *           description: Departamento donde se ubica la empresa
 *           example: LIMA
 *         provincia:
 *           type: string   
 *           description: Provincia donde se ubica la empresa
 *           example: LIMA
 *         distrito:
 *           type: string
 *           description: Distrito donde se ubica la empresa
 *           example: SAN BORJA
 *         direccion:
 *           type: string
 *           description: Dirección donde está la empresa
 *           example: CALLE MIRAFLORES 123
 *         direccion_completa:
 *           type: string
 *           description: Dirección completa donde está la empresa
 *           example: CALLE MIRAFLORES 123 - LIMA - LIMA - SAN BORJA
 *         ubigeo_sunat:
 *           type: string
 *           description: Código de referencia de ubicación de la empresa
 *           example: 010203
 *         sistema:
 *           type: boolean
 *           description: Indica si la empresa es definida por el sistema
 *           example: false
 *         estado:
 *           type: boolean
 *           description: Estado actual de la empresa (activo/inactivo)
 *           example: true
 *     EmpresaResponse:
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
 * /api/v1/empresas:
 *   get:
 *     summary: Obtiene un listado de todas las empresas.
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Un listado de empresas
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/EmpresaResponse'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authToken, EmpresaController.getAllEmpresas)

/**
 * @swagger
 * /api/v1/empresas/info-api/ruc/{ruc}:
 *   get:
 *     summary: Obtiene una única empresa obtenido desde la API
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: ruc
 *         required: true
 *         schema:
 *           type: string
 *           description: RUC de la persona a obtener
 *     responses:
 *       200:
 *         description: La descripción de la empresa por RUC
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/EmpresaResponse'
 *       404:
 *         description: la empresa no fue encontrada
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
router.get('/ruc/:ruc', authToken, EmpresaController.getEmpresaByApi)

export default router