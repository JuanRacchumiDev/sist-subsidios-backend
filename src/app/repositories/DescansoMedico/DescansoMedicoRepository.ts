import { DescansoMedicoResponse, DescansoMedicoResponsePaginate, IDescansoMedico, IDescansoMedicoPaginate } from "../../interfaces/DescansoMedico/IDescansoMedico";
import { Colaborador } from "../../models/Colaborador";
import { DescansoMedico } from "../../models/DescansoMedico";
import { Diagnostico } from "../../models/Diagnostico";
import { Establecimiento } from "../../models/Establecimiento";
import { TipoContingencia } from "../../models/TipoContingencia";
import { TipoDescansoMedico } from "../../models/TipoDescansoMedico";
import sequelize from "../../../config/database";
import { DESCANSOMEDICO_ATTRIBUTES } from "../../../constants/DescansoMedicoConstant";
import HPagination from "../../../helpers/HPagination";

const COLABORADOR_INCLUDE = {
    model: Colaborador,
    as: 'colaborador',
    attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno']
}

const TIPODM_INCLUDE = {
    model: TipoDescansoMedico,
    as: 'tipoDescansoMedico',
    attributes: ['id', 'nombre']
}

const TIPOCONTINGENCIA_INCLUDE = {
    model: TipoContingencia,
    as: 'tipoContingencia',
    attributes: ['id', 'nombre']
}

const DIAGNOSTICO_INCLUDE = {
    model: Diagnostico,
    as: 'diagnostico',
    attributes: ['codCie10', 'nombre']
}

// const ESTABLECIMIENTO_INCLUDE = {
//     model: Establecimiento,
//     as: 'establecimiento',
//     attributes: ['id', 'nombre']
// }

class DescansoMedicoRepository {
    /**
     * Obtiene todos los descansos médicos
     * @returns {Promise<DescansoMedicoResponse>}
     */
    async getAll(): Promise<DescansoMedicoResponse> {
        try {
            const descansos = await DescansoMedico.findAll({
                attributes: DESCANSOMEDICO_ATTRIBUTES,
                include: [
                    COLABORADOR_INCLUDE,
                    TIPODM_INCLUDE,
                    TIPOCONTINGENCIA_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ],
                order: [
                    ['fecha_inicio', 'DESC']
                ]
            })

            return { result: true, data: descansos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<DescansoMedicoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await DescansoMedico.findAndCountAll({
                attributes: DESCANSOMEDICO_ATTRIBUTES,
                include: [
                    COLABORADOR_INCLUDE,
                    TIPODM_INCLUDE,
                    TIPOCONTINGENCIA_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ],
                where: whereClause,
                order: [
                    ['fecha_inicio', 'DESC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IDescansoMedicoPaginate = {
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
     * Obtiene un descanso médico por su ID
     * @param {string} id - El ID UUID del descanso médico a buscar
     * @returns {Promise<DescansoMedicoResponse>} Respuesta con el descanso médico encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<DescansoMedicoResponse> {
        try {
            const descanso = await DescansoMedico.findByPk(id, {
                attributes: DESCANSOMEDICO_ATTRIBUTES,
                include: [
                    COLABORADOR_INCLUDE,
                    TIPODM_INCLUDE,
                    TIPOCONTINGENCIA_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ]
            })

            if (!descanso) {
                return {
                    result: false,
                    data: [],
                    message: 'Descanso médico no encontrado',
                    status: 404
                }
            }

            return {
                result: true,
                data: descanso,
                message: 'Descanso médico encontrado',
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return {
                result: false,
                error: errorMessage,
                status: 500
            }
        }
    }

    /**
     * Crea un descanso médico
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear
     * @returns {Promise<DescansoMedicoResponse>} Respuesta con el descanso médico creado o error
     */
    async create(data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        const t = await sequelize.transaction()

        try {
            const newDescanso = await DescansoMedico.create(data)

            await t.commit()

            const { id: idDescanso } = newDescanso

            if (!idDescanso) {
                return {
                    result: false,
                    error: 'Error al registrar el descanso médico',
                    data: [],
                    status: 500
                }
            }

            return {
                result: true,
                message: 'Descanso médico registrado con éxito',
                data: newDescanso,
                status: 200
            }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un descanso médico existente por su ID
     * @param {string} id - El ID del descanso médico a actualizar
     * @param {IDescansoMedico} data - Los nuevos datos del descanso médico
     * @returns {Promise<DescansoMedicoResponse>} Respuesta con el descanso médico actualizado o error
     */
    async update(id: string, data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        const t = await sequelize.transaction()

        try {
            const descanso = await DescansoMedico.findByPk(id, { transaction: t })

            if (!descanso) {
                await t.rollback();
                return {
                    result: false,
                    data: [],
                    message: 'Descanso médico no encontrado',
                    status: 200
                }
            }

            const dataUpdateDescanso: Partial<IDescansoMedico> = data

            const updatedDescanso = await descanso.update(dataUpdateDescanso, { transaction: t })

            await t.commit()

            return { result: true, message: 'Descanso médico actualizado con éxito', data: updatedDescanso, status: 200 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default new DescansoMedicoRepository()