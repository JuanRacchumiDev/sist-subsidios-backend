import { TValidateFields } from '../../types/TTypeFields';
import sequelize from '../../../config/database'
import { ICobro, ICobroPaginate, CobroResponse, CobroResponsePaginate } from "../../interfaces/Cobro/ICobro"
import { Cobro } from "../../models/Cobro"
import { Op } from "sequelize";
import { COBRO_ATTRIBUTES } from '../../../constants/CobroConstant';
import HPagination from '../../../helpers/HPagination';

class CobroRepository {
    /**
    * Obtiene todas los cobros
    * @returns {Promise<CobroResponse>}
    */
    async getAll(): Promise<CobroResponse> {
        try {
            const cobros = await Cobro.findAll({
                attributes: COBRO_ATTRIBUTES,
                order: [
                    ['fecha_registro', 'ASC']
                ]
            })

            return { result: true, data: cobros, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<CobroResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Cobro.findAndCountAll({
                attributes: COBRO_ATTRIBUTES,
                where: whereClause,
                order: [
                    ['fecha_registro', 'ASC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: ICobroPaginate = {
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
     * Obtiene todas los cobros por estado
     * @param {boolean} estado - El estado de los cobros a buscar
     * @returns {Promise<CobroResponse>}>} Respuesta con la lista de cobros filtrados
     */
    async getAllByEstado(estado: boolean): Promise<CobroResponse> {
        try {
            const cobros = await Cobro.findAll({
                where: {
                    estado
                },
                attributes: COBRO_ATTRIBUTES,
                order: [
                    ['fecha_registro', 'ASC']
                ]
            })

            return { result: true, data: cobros, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un cobro por su ID
     * @param {string} id - El ID UUID del cobro a buscar
     * @returns {Promise<CobroResponse>} Respuesta con el cobro encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<CobroResponse> {
        try {
            const cobro = await Cobro.findByPk(id, {
                attributes: COBRO_ATTRIBUTES
            })

            if (!cobro) {
                return { result: false, data: [], message: 'Cobro no encontrado', status: 404 }
            }

            return { result: true, data: cobro, message: 'Cobro encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un cobro
     * @param {ICobro} data - Los datos del cobro a crear
     * @returns {Promise<CobroResponse>} Respuesta con el cobro creada o error
     */
    async create(data: ICobro): Promise<CobroResponse> {
        // const transaction = await sequelize.transaction()

        try {
            const { codigo } = data

            if (!codigo) {
                return { result: false, message: 'El código es requerido para crear un cobro' }
            }

            const fields = { codigo }

            const validateFields = await this.validateFieldsRegistered(fields, "crear")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const newCobro = await Cobro.create(data)

            // await transaction.commit()

            if (newCobro.id) {
                return { result: true, message: 'Cobro registrado con éxito', data: newCobro, status: 200 }
            }

            return { result: false, error: 'Error al registrar el cobro', data: [], status: 500 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un cobro existente
     * @param {string} id - El ID del cobro a actualizar 
     * @param {ICobro} data - Los nuevos datos del cobro 
     * @returns {Promise<CobroResponse>} Respuesta con el cobro actualizado
     */
    async update(id: string, data: ICobro): Promise<CobroResponse> {
        try {
            const cobro = await Cobro.findByPk(id)

            if (!cobro) {
                return { result: false, data: [], message: 'Cobro no encontrado', status: 404 }
            }

            const { codigo } = data

            const fields = { codigo }

            const validateFields = await this.validateFieldsRegistered(fields, "actualizar")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const payload: Partial<ICobro> = data

            const updatedCobro = await cobro.update(payload)

            return { result: true, message: 'Cobro actualizado con éxito', data: updatedCobro, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un cobro
     * @param {string} id - El ID del cobro 
     * @param {boolean} estado - El nuevo estado del cobro 
     * @returns {Promise<CobroResponse>} Respuesta con el cobro actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<CobroResponse> {
        try {
            const cobro = await Cobro.findByPk(id)

            if (!cobro) {
                return { result: false, message: 'Cobro no encontrado', status: 404 }
            }

            cobro.estado = estado
            await cobro.save()

            return { result: true, message: 'Cobro actualizado con éxito', data: cobro, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un cobro
     * @param {string} id - El ID del cobro a eliminar
     * @returns {Promise<CobroResponse>} Respuesta con el cobro eliminado 
     */
    async delete(id: string): Promise<CobroResponse> {
        try {
            const cobro = await Cobro.findByPk(id);

            if (!cobro) {
                return { result: false, data: [], message: 'Cobro no encontrado', status: 404 };
            }

            await cobro.destroy();

            return { result: true, data: cobro, message: 'Cobro eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }

    async validateFieldsRegistered(
        fields: { codigo?: string },
        accion: string
    ): Promise<TValidateFields> {
        const { codigo } = fields

        let returnValidate: TValidateFields = {
            result: false,
            message: ""
        }

        if (codigo) {
            const whereConditions: any[] = []

            if (codigo) {
                whereConditions.push({ codigo })
            }

            const existingCobro = await Cobro.findOne({
                where: {
                    [Op.or]: whereConditions
                }
            })

            if (existingCobro) {
                const message = `El código por ${accion} ya existe`
                returnValidate.result = true
                returnValidate.message = message
            }
        }

        return returnValidate
    }
}

export default new CobroRepository()