import { CanjeResponse, CanjeResponsePaginate, ICanje, ICanjePaginate } from "../../interfaces/Canje/ICanje"
import { Canje } from "../../models/Canje"
import { DescansoMedico } from "../../models/DescansoMedico"
import sequelize from "../../../config/database"
import { CANJE_ATTRIBUTES } from "../../../constants/CanjeConstant"
import HPagination from "../../../helpers/HPagination"

const DESCANSOMEDICO_INCLUDE = {
    model: DescansoMedico,
    as: 'descansoMedico',
    attributes: ['id', 'codigo', 'fecha_otorgamiento', 'fecha_inicio', 'fecha_final']
}

class CanjeRepository {
    /**
     * Obtiene todos los canjes
     * @returns {Promise<CanjeResponse>}
     */
    async getAll(): Promise<CanjeResponse> {
        try {
            const canjes = await Canje.findAll({
                attributes: CANJE_ATTRIBUTES,
                include: [DESCANSOMEDICO_INCLUDE],
                order: [
                    ['fecha_inicio_subsidio', 'DESC']
                ]
            })

            return { result: true, data: canjes, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<CanjeResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Canje.findAndCountAll({
                attributes: CANJE_ATTRIBUTES,
                include: [DESCANSOMEDICO_INCLUDE],
                where: whereClause,
                order: [
                    ['fecha_inicio_subsidio', 'DESC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: ICanjePaginate = {
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
     * Obtiene un canje por su ID
     * @param {string} id - El ID UUID del canje a buscar
     * @returns {Promise<CanjeResponse>} Respuesta con el canje encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<CanjeResponse> {
        try {
            const canje = await Canje.findByPk(id, {
                attributes: CANJE_ATTRIBUTES,
                include: [DESCANSOMEDICO_INCLUDE]
            })

            if (!canje) {
                return {
                    result: false,
                    data: [],
                    message: 'Canje no encontrado',
                    status: 404
                }
            }

            return {
                result: true,
                data: canje,
                message: 'Canje encontrado',
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un canje
     * @param {ICanje} data - Los datos del canje a crear
     * @returns {Promise<CanjeResponse>} Respuesta con el canje creado o error
     */
    async create(data: ICanje): Promise<CanjeResponse> {
        const t = await sequelize.transaction()

        try {
            const newCanje = await Canje.create(data)

            await t.commit()

            const { id: idCanje } = newCanje

            if (!idCanje) {
                return {
                    result: false,
                    error: 'Error al registrar el canje',
                    data: [],
                    status: 500
                }
            }

            return {
                result: true,
                message: 'Canje registrado con éxito',
                data: newCanje,
                status: 200
            }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un canje existente por su ID
     * @param {string} id - El ID del canje a actualizar
     * @param {ICanje} data - Los nuevos datos del canje
     * @returns {Promise<CanjeResponse>} Respuesta con el canje actualizado o error
     */
    async update(id: string, data: ICanje): Promise<CanjeResponse> {
        const t = await sequelize.transaction()

        try {
            const canje = await Canje.findByPk(id, { transaction: t })

            if (!canje) {
                await t.rollback();
                return {
                    result: false,
                    data: [],
                    message: 'Canje no encontrado',
                    status: 200
                }
            }

            const dataUpdateCanje: Partial<ICanje> = data

            const updatedCanje = await canje.update(dataUpdateCanje, { transaction: t })

            await t.commit()

            return { result: true, message: 'Canje actualizado con éxito', data: updatedCanje, status: 200 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default new CanjeRepository()