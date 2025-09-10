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
import { TTotalDias } from '../../types/DescansoMedico/TTotalDias';
import { Transaction } from "sequelize";
import { parseISO, addDays } from 'date-fns';
import { COLABORADOR_INCLUDE } from "../../../includes/ColaboradorInclude";
import { TIPODM_INCLUDE } from "../../../includes/TipoDescansoMedicoInclude";
import { TIPO_CONTINGENCIA_INCLUDE } from "../../../includes/TipoContingenciaInclude";
import { DIAGNOSTICO_INCLUDE } from "../../../includes/DiagnosticoInclude";

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
                    TIPO_CONTINGENCIA_INCLUDE,
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
                    TIPO_CONTINGENCIA_INCLUDE,
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
     * Obtiene todos los descansos médicos por colaborador
     * @param {string} idColaborador - El ID del colaborador a buscar
     * @returns {Promise<DescansoMedicoResponse>}
     */
    async getAllByColaborador(idColaborador: string): Promise<DescansoMedicoResponse> {
        try {
            const descansos = await DescansoMedico.findAll({
                attributes: DESCANSOMEDICO_ATTRIBUTES,
                include: [
                    COLABORADOR_INCLUDE,
                    TIPODM_INCLUDE,
                    TIPO_CONTINGENCIA_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ],
                where: {
                    id_colaborador: idColaborador
                }
            })

            return { result: true, data: descansos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Calcula el total de días de descansos médicos para un colaborador
     * @param {string} idColaborador - El ID del colaborador a buscar
     * @return {Promise<TTotalDias>} La suma de días acumulados
     */
    async getTotalDiasByColaborador(idColaborador: string): Promise<TTotalDias> {
        try {
            const result = await DescansoMedico.sum('total_dias', {
                where: {
                    id_colaborador: idColaborador
                }
            })

            const totalDias = result || 0
            return { result: true, data: totalDias, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
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
                    TIPO_CONTINGENCIA_INCLUDE,
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
     * Valida si un nuevo descanso médico es consecutivo al anterior
     * @param {string} idColaborador - El ID del colaborador
     * @param {string} fechaInicioNuevo - La fecha de inicio del nuevo descanso (formato 'YYYY-MM-DD')
     * @returns {Promise<boolean>} Retorna true si es consecutivo o si no hay registros previos, de lo contrario false
     */
    async isDescansoConsecutivo(idColaborador: string, fechaInicioNuevo: string): Promise<boolean> {
        try {
            const ultimoDescanso = await DescansoMedico.findOne({
                where: { id_colaborador: idColaborador },
                order: [['fecha_final', 'DESC']],
                limit: 1
            });

            // Si no hay descansos previos, es el primero y se considera continuo.
            if (!ultimoDescanso) {
                return true;
            }

            const { fecha_final } = ultimoDescanso

            // Convertir las fechas a objetos Date
            const fechaFinalAnterior = parseISO(fecha_final as string);

            const fechaInicioNueva = parseISO(fechaInicioNuevo);

            // Sumar 1 día a la fecha final del descanso anterior
            const diaSiguiente = addDays(fechaFinalAnterior, 1);

            // Comparar si la nueva fecha de inicio es igual al día siguiente de la fecha final anterior.
            // Para la comparación, solo nos interesa la fecha, no la hora, lo cual parseISO ya maneja.
            const esMismoDia = fechaInicioNueva.getTime() === diaSiguiente.getTime();

            return esMismoDia;
        } catch (error) {
            console.error('Error al validar la continuidad del descanso médico:', error);
            // En caso de error, retornamos false para evitar registros incorrectos.
            return false;
        }
    }

    /**
     * Crea un descanso médico
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear
     * @param {Transaction} [t] - Objeto de transacción de Sequelize opcional.
     * @returns {Promise<DescansoMedicoResponse>} Respuesta con el descanso médico creado o error
     */
    async create(data: IDescansoMedico, t?: Transaction): Promise<DescansoMedicoResponse> {
        const { id_colaborador, fecha_inicio } = data

        const esContinuo = await this.isDescansoConsecutivo(id_colaborador!, fecha_inicio!)

        const payload: IDescansoMedico = {
            ...data,
            is_continuo: esContinuo
        }

        try {
            const newDescanso = await DescansoMedico.create(payload, { transaction: t })

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