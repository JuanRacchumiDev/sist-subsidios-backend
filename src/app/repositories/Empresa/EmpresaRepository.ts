import { TValidateFields } from '../../types/TTypeFields';
import sequelize from '../../../config/database'
import { IEmpresa, IEmpresaPaginate, EmpresaResponse, EmpresaResponsePaginate } from "../../interfaces/Empresa/IEmpresa"
import { Empresa } from "../../models/Empresa"
import { RepresentanteLegal } from "../../models/RepresentanteLegal"
import { Cargo } from "../../models/Cargo"
import { Op } from "sequelize";
import { EMPRESA_ATTRIBUTES } from '../../../constants/EmpresaConstant';
import { REPRESENTANTE_LEGAL_ATTRIBUTES } from '../../../constants/RepresentanteLegalConstant';
import { CARGO_ATTRIBUTES } from '../../../constants/CargoConstant';
import HPagination from '../../../helpers/HPagination';

class EmpresaRepository {
    /**
    * Obtiene todas las empresas
    * @returns {Promise<EmpresaResponse>}
    */
    async getAll(): Promise<EmpresaResponse> {
        try {
            const empresas = await Empresa.findAll({
                attributes: EMPRESA_ATTRIBUTES,
                order: [
                    ['nombre_o_razon_social', 'ASC']
                ]
            })

            return { result: true, data: empresas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(
        page: number,
        limit: number,
        filter: string
    ): Promise<EmpresaResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause: any = {}

            if (filter) {
                const filterValue = `%${filter}%`

                whereClause[Op.or] = [
                    {
                        nombre_o_razon_social: {
                            [Op.like]: filterValue
                        }
                    },
                    {
                        numero: {
                            [Op.like]: filterValue
                        }
                    }
                ]
            }

            const { count, rows } = await Empresa.findAndCountAll({
                attributes: EMPRESA_ATTRIBUTES,
                where: whereClause,
                order: [
                    ['nombre_o_razon_social', 'ASC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IEmpresaPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: count,
                nextPage,
                previousPage
            }

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas las empresas por estado
     * @param {boolean} estado - El estado de las empresas a buscar
     * @returns {Promise<EmpresaResponse>}>} Respuesta con la lista de empresas filtradas
     */
    async getAllByEstado(estado: boolean): Promise<EmpresaResponse> {
        try {
            const empresas = await Empresa.findAll({
                where: {
                    estado
                },
                attributes: EMPRESA_ATTRIBUTES,
                order: [
                    ['nombre_o_razon_social', 'ASC']
                ]
            })

            return { result: true, data: empresas, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene una empresa por su ID
     * @param {string} id - El ID UUID de la empresa a buscar
     * @returns {Promise<EmpresaResponse>} Respuesta con la empresa encontrada o mensaje de no encontrada
     */
    async getById(id: string): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id, {
                attributes: EMPRESA_ATTRIBUTES,
                include: [{
                    model: RepresentanteLegal,
                    as: 'representantes',
                    attributes: REPRESENTANTE_LEGAL_ATTRIBUTES,
                    include: [{
                        model: Cargo,
                        as: 'cargo',
                        attributes: CARGO_ATTRIBUTES
                    }]
                }]
            })

            if (!empresa) {
                return { result: false, data: [], message: 'Empresa no encontrada', status: 404 }
            }

            return { result: true, data: empresa, message: 'Empresa encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene una empresa por su nombre de razón social
     * @param {string} nombre_o_razon_social - El nombre de la empresa a buscar 
     * @returns {Promise<EmpresaResponse>} Respuesta con la empresa encontrada o mensaje de no encontrada
     */
    async getByNombre(nombre_o_razon_social: string): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findOne({
                where: {
                    nombre_o_razon_social
                },
                attributes: EMPRESA_ATTRIBUTES
            })

            if (!empresa) {
                return { result: false, data: [], message: 'Empresa no encontrada', status: 404 }
            }

            return { result: true, data: empresa, message: 'Empresa encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea una empresa
     * @param {IEmpresa} data - Los datos de la empresa a crear
     * @returns {Promise<EmpresaResponse>} Respuesta con la empresa creada o error
     */
    async create(data: IEmpresa): Promise<EmpresaResponse> {
        // const transaction = await sequelize.transaction()

        try {
            const { nombre_o_razon_social, numero } = data

            if (!nombre_o_razon_social || !numero) {
                return { result: false, message: 'La razón social o el número de ruc son requeridos para crear una empresa' }
            }

            const fields = { nombre: nombre_o_razon_social, numero }

            const validateFields = await this.validateFieldsRegistered(fields, "crear")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const newEmpresa = await Empresa.create(data)

            // await transaction.commit()

            if (newEmpresa.id) {
                return { result: true, message: 'Empresa registrada con éxito', data: newEmpresa, status: 200 }
            }

            return { result: false, error: 'Error al registrar la empresa', data: [], status: 500 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza una empresa existente
     * @param {string} id - El ID de la empresa a actualizar 
     * @param {IEmpresa} data - Los nuevos datos de la empresa 
     * @returns {Promise<EmpresaResponse>} Respuesta con la empresa actualizada
     */
    async update(id: string, data: IEmpresa): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id)

            if (!empresa) {
                return { result: false, data: [], message: 'Empresa no encontrada', status: 404 }
            }

            const { nombre_o_razon_social, numero } = data

            const fields = { nombre: nombre_o_razon_social, numero }

            const validateFields = await this.validateFieldsRegistered(fields, "actualizar")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const dataEmpresa: Partial<IEmpresa> = data

            const updatedEmpresa = await empresa.update(dataEmpresa)

            return { result: true, message: 'Empresa actualizada con éxito', data: updatedEmpresa, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de una empresa
     * @param {string} id - El ID de la empresa 
     * @param {boolean} estado - El nuevo estado de la empresa 
     * @returns {Promise<EmpresaResponse>} Respuesta con la empresa actualizada
     */
    async updateEstado(id: string, estado: boolean): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id)

            if (!empresa) {
                return { result: false, message: 'Empresa no encontrada', status: 404 }
            }

            empresa.estado = estado
            await empresa.save()

            return { result: true, message: 'Estado actualizado con éxito', data: empresa, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) una empresa
     * @param {string} id - El ID de la empresa a eliminar
     * @returns {Promise<EmpresaResponse>} Respuesta con la empresa eliminado 
     */
    async delete(id: string): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id);

            if (!empresa) {
                return { result: false, data: [], message: 'Empresa no encontrada', status: 404 };
            }

            await empresa.destroy();

            return { result: true, data: empresa, message: 'Empresa eliminada¿o correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }

    async validateFieldsRegistered(
        fields: { nombre?: string, numero?: string },
        accion: string
    ): Promise<TValidateFields> {
        const { nombre, numero } = fields

        let returnValidate: TValidateFields = {
            result: false,
            message: ""
        }

        if (nombre || numero) {
            const whereConditions: any[] = []

            if (nombre) {
                whereConditions.push({ nombre_o_razon_social: nombre })
            }

            if (numero) {
                whereConditions.push({ numero })
            }

            const existingEmpresa = await Empresa.findOne({
                where: {
                    [Op.or]: whereConditions
                }
            })

            if (existingEmpresa) {
                const message = `La razón social o ruc por ${accion} ya existen`
                returnValidate.result = true
                returnValidate.message = message
            }
        }

        return returnValidate
    }
}

// export default new EmpresaRepository()

export default EmpresaRepository