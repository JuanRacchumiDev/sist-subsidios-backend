import {
    DescansoMedicoResponse,
    DescansoMedicoResponsePaginate,
    IDescansoMedico,
    IDescansoMedicoPaginate
} from "../../interfaces/DescansoMedico/IDescansoMedico";
import { DescansoMedico } from "../../models/DescansoMedico";
import sequelize from "../../../config/database";
import { DESCANSOMEDICO_ATTRIBUTES } from "../../../constants/DescansoMedicoConstant";
import HPagination from "../../../helpers/HPagination";
import { TTotalDias } from '../../types/DescansoMedico/TTotalDias';
import { parseISO, addDays } from 'date-fns';
import { COLABORADOR_DM_INCLUDE } from "../../../includes/ColaboradorDMInclude";
import { DIAGNOSTICO_INCLUDE } from "../../../includes/DiagnosticoInclude";
import { Op, QueryTypes, WhereOptions } from 'sequelize';
import HDate from "../../../helpers/HDate"
import { ADJUNTO_INCLUDE } from "../../../includes/AdjuntoInclude";
import { EDescansoMedico } from "../../enums/EDescansoMedico";
import {
    TItemReportDescansos,
    TItemReportSubsidios
} from "../../types/DescansoMedico/TItemReport";
import { Canje } from "../../models/Canje";
import { IDescansoMedicoFilter } from '../../interfaces/DescansoMedico/IDescansoMedicoFilter';
import { DETALLE_PARAMETRO_INCLUDE } from "../../../includes/DetalleParametroInclude"

type TReportDescansosResponse = {
    result: boolean
    message?: string
    data?: TItemReportDescansos | TItemReportDescansos[]
    error?: string
    status?: number
}

type TReportCanjesResponse = {
    result: boolean
    message?: string
    data?: TItemReportSubsidios | TItemReportSubsidios[]
    error?: string
    status?: number
}

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
                    COLABORADOR_DM_INCLUDE,
                    DETALLE_PARAMETRO_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ],
                order: [
                    ['fecha_inicio', 'ASC']
                ]
            })

            return { result: true, data: descansos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllPaginate(
        page: number,
        limit: number,
        filters: IDescansoMedicoFilter = {}
    ): Promise<DescansoMedicoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const {
                id_tipodescansomedico,
                id_tipocontingencia,
                id_empresa,
                nombre_colaborador,
                fecha_inicio,
                fecha_final,
                user_crea
            } = filters

            // 1. Condiciones iniciales
            const conditions = ["1 = 1"];
            const replacements: any = { limit, offset };

            // 2. Filtros dinámicos
            if (id_empresa) {
                conditions.push("p.id_empresa = :id_empresa");
                replacements.id_empresa = id_empresa;
            }

            if (id_tipodescansomedico) {
                conditions.push("dm.id_tipodescansomedico = :id_tipodescansomedico");
                replacements.id_tipodescansomedico = id_tipodescansomedico;
            }

            if (id_tipocontingencia) {
                conditions.push("dm.id_tipocontingencia = :id_tipocontingencia");
                replacements.id_tipocontingencia = id_tipocontingencia;
            }

            if (user_crea) {
                conditions.push("dm.user_crea = :user_crea");
                replacements.user_crea = user_crea;
            }

            // Búsqueda Case Insensitive por nombre de colaborador
            if (nombre_colaborador) {
                conditions.push("LOWER(p.nombre_completo) LIKE LOWER(:nombre_colaborador)");
                replacements.nombre_colaborador = `%${nombre_colaborador}%`;
            }

            // Filtro para fecha de inicio
            if (fecha_inicio && !fecha_final) {
                conditions.push("dm.fecha_inicio >= :fecha_inicio")
                replacements.fecha_inicio = fecha_inicio
            }

            // Filtro para fecha final
            if (!fecha_inicio && fecha_final) {
                conditions.push("dm.fecha_final <= :fecha_final")
                replacements.fecha_final = fecha_final
            }

            // Filtro por rango de fechas (Fecha de inicio del descanso)
            if (fecha_inicio && fecha_final) {
                conditions.push("dm.fecha_inicio >= :fecha_inicio AND dm.fecha_final <= :fecha_final");
                replacements.fecha_inicio = fecha_inicio;
                replacements.fecha_final = fecha_final;
            }

            const whereClause = `WHERE ${conditions.join(" AND ")}`;

            console.log({ whereClause })

            // 3. Consultas
            const baseQuery = `
                FROM descanso_medico dm
                INNER JOIN persona p ON p.id = dm.id_colaborador
                INNER JOIN detalle_parametro dp_tipo ON dp_tipo.id = dm.id_tipodescansomedico
                INNER JOIN detalle_parametro dp_cont ON dp_cont.id = dm.id_tipocontingencia
                INNER JOIN empresa e ON e.id = p.id_empresa
                ${whereClause}
            `;

            const queryData = `
                SELECT 
                    dm.id, dm.id_colaborador, dm.id_empresa, dm.id_tipodescansomedico, dm.id_tipocontingencia,
                    dm.codcie10_diagnostico, dm.correlativo, dm.codigo, dm.codigo_citt, dm.fecha_inicio, dm.fecha_final,
                    dm.fecha_otorgamiento, dm.mes_devengado, dm.numero_colegiatura, dm.medico_tratante,
                    dm.nombre_colaborador, dm.nombre_tipodescansomedico, dm.nombre_tipocontingencia, dm.nombre_diagnostico,
                    dm.nombre_establecimiento, dm.total_dias, dm.codigo_temp, dm.user_crea,
                    dm.is_subsidio, dm.is_acepta_responsabilidad, dm.is_acepta_politica,
                    dm.is_continuo, dm.estado_registro, dm.estado,
                    p.apellido_paterno as apellido_paterno_colaborador,
                    p.apellido_materno as apellido_materno_colaborador,
                    p.nombres as nombres_colaborador,
                    p.nombre_completo as nombre_colaborador, 
                    dp_tipo.nombre as nombre_tipo_descanso,
                    dp_cont.nombre as nombre_tipo_contingencia,
                    e.nombre_o_razon_social as nombre_empresa
                ${baseQuery}
                ORDER BY dm.correlativo ASC
                LIMIT :limit OFFSET :offset;
            `;

            const queryCount = `SELECT COUNT(dm.id) as total ${baseQuery}`;

            const rows = await sequelize.query(queryData, {
                replacements,
                type: 'SELECT',
                model: DescansoMedico,
                mapToModel: true
            });

            console.log({ rows })

            const [countResult]: any = await sequelize.query(queryCount, {
                replacements,
                type: 'SELECT'
            });

            const total = parseInt(countResult.total);
            const totalPages = Math.ceil(total / limit)
            const nextPage = HPagination.getNextPage(page, limit, total)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IDescansoMedicoPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: total,
                nextPage,
                previousPage
            }

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            };

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
                    COLABORADOR_DM_INCLUDE,
                    DETALLE_PARAMETRO_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ],
                where: {
                    id_colaborador: idColaborador
                },
                order: [
                    ['correlativo', 'ASC']
                ],
            })

            return { result: true, data: descansos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todos los descansos médicos por colaborador con paginación
     * @param {string} idColaborador - El ID del colaborador a buscar
     * @param {number} page - El número de página actual
     * @param {number} limit - El número de elementos por página
     * @param {IDescansoMedicoFilter} filters - Los parámetros a buscar
     * @returns {Promise<DescansoMedicoResponsePaginate>}
     */
    async getAllByColaboradorPaginate(
        idColaborador: string,
        page: number,
        limit: number,
        filters: IDescansoMedicoFilter
    ): Promise<DescansoMedicoResponsePaginate> {
        try {
            const offset = HPagination.getOffset(page, limit);

            // Construcción dinámica de la claúsula WHERE
            const where: WhereOptions = {}

            where.id_colaborador = idColaborador

            // Filtro por tipo de descanso médico (id_tipodescansomedico)
            if (filters.id_tipodescansomedico) {
                where.id_tipodescansomedico = filters.id_tipodescansomedico
            }

            // Filtro por tipo de contingencia (id_tipocontingencia)
            if (filters.id_tipocontingencia) {
                where.id_tipocontingencia = filters.id_tipocontingencia
            }

            // Filtro por rango de fechas
            if (filters.fecha_inicio && filters.fecha_final) {
                where.fecha_inicio = {
                    [Op.lte]: filters.fecha_final
                }

                where.fecha_final = {
                    [Op.gte]: filters.fecha_inicio
                }
            } else if (filters.fecha_inicio) {
                where.fecha_inicio = {
                    [Op.gte]: filters.fecha_inicio
                };
            } else if (filters.fecha_final) {
                where.fecha_final = {
                    [Op.lte]: filters.fecha_final
                };
            }

            const { count, rows } = await DescansoMedico.findAndCountAll({
                attributes: DESCANSOMEDICO_ATTRIBUTES,
                include: [
                    COLABORADOR_DM_INCLUDE,
                    DETALLE_PARAMETRO_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ],
                where,
                order: [
                    ['correlativo', 'ASC']
                ],
                limit,
                offset
            });

            const totalPages = Math.ceil(count / limit);
            const nextPage = HPagination.getNextPage(page, limit, count);
            const previousPage = HPagination.getPreviousPage(page);

            const pagination: IDescansoMedicoPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: count,
                nextPage,
                previousPage
            };

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            };
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
            const descansosMedicos = await DescansoMedico.findAll({
                where: {
                    id_colaborador: idColaborador,
                    estado_registro: EDescansoMedico.REGISTRO_EXITOSO
                },
                order: [
                    ['correlativo', 'ASC']
                ]
            });

            // Suma los 'total_dias' de los resultados obtenidos
            const totalDias = descansosMedicos.reduce((sum, dm) => {
                return sum + Number(dm.total_dias)
            }, 0)

            // console.log('result días registrados', result)

            // const totalDias = result || 0

            return { result: true, data: totalDias, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }

    /**
     * Calcula el total de días de descansos médicos para un colaborador
     * @param {string} idColaborador - El ID del colaborador a buscar
     * @param {string} idDescansoMedico - El ID del descanso médico a excluir de la suma
     * @param {string} fechaOtorgamiento - La fecha de otorgamiento a considerar
     * @return {Promise<TTotalDias>} La suma de días acumulados
     */
    async getTotalDiasByColaboradorWithoutIdDescanso(
        idColaborador: string,
        idDescansoMedico: string,
        fechaOtorgamiento: string
    ): Promise<TTotalDias> {
        try {
            const descansosMedicos = await DescansoMedico.findAll({
                attributes: [
                    'fecha_inicio_ingresado',
                    'fecha_final_ingresado',
                    'fecha_otorgamiento',
                    'fecha_inicio',
                    'fecha_final',
                    'total_dias',
                ],
                where: {
                    id_colaborador: idColaborador,
                    estado_registro: EDescansoMedico.REGISTRO_EXITOSO,
                    id: {
                        [Op.ne]: idDescansoMedico
                    },
                    [Op.and]: [
                        {
                            fecha_otorgamiento: {
                                [Op.lte]: fechaOtorgamiento
                            }
                        }
                    ]
                },
                order: [
                    ['correlativo', 'ASC']
                ],
                plain: false
            });

            // Suma los 'total_dias' de los resultados obtenidos
            const totalDias = descansosMedicos.reduce((sum, dm) => {
                return sum + Number(dm.total_dias)
            }, 0)

            // console.log('result días registrados', result)

            // const totalDias = result || 0

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
                    COLABORADOR_DM_INCLUDE,
                    DETALLE_PARAMETRO_INCLUDE,
                    DIAGNOSTICO_INCLUDE,
                    ADJUNTO_INCLUDE
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
            let continuo: boolean = false

            console.log({ fechaInicioNuevo })

            const ultimoDescanso = await DescansoMedico.findOne({
                where: { id_colaborador: idColaborador },
                order: [
                    ['fecha_final', 'DESC']
                ],
                limit: 1
            });

            // Si no hay descansos previos, es el primero y se considera continuo.
            if (!ultimoDescanso) {
                continuo = true;
            }

            console.log({ ultimoDescanso })

            const { fecha_final } = ultimoDescanso as DescansoMedico

            const fechaFinal = fecha_final as string

            console.log({ fechaFinal })

            // Convertir las fechas a objetos Date
            const fechaFinalAnterior = parseISO(fechaFinal);

            console.log({ fechaFinalAnterior })

            const fechaInicioNueva = parseISO(fechaInicioNuevo);

            console.log({ fechaInicioNueva })

            // Sumar 1 día a la fecha final del descanso anterior
            const diaSiguiente = addDays(fechaFinalAnterior, 1);

            console.log('fechaFinalAnterior', fechaFinalAnterior)
            console.log('fechaInicioNueva', fechaInicioNueva)
            console.log('diaSiguiente', diaSiguiente)
            console.log('fechaInicioNueva.getTime()', fechaInicioNueva.getTime())
            console.log('diaSiguiente.getTime()', diaSiguiente.getTime())

            // Comparar si la nueva fecha de inicio es igual al día siguiente de la fecha final anterior.
            // Para la comparación, solo nos interesa la fecha, no la hora, lo cual parseISO ya maneja.
            // const esMismoDia = fechaInicioNueva.getTime() === diaSiguiente.getTime();

            // console.log({ esMismoDia })

            if (fechaInicioNueva.getTime() === diaSiguiente.getTime()) {
                continuo = true
            } else if (fechaInicioNueva.getTime() !== diaSiguiente.getTime() && !ultimoDescanso?.is_continuo) {
                continuo = true
            } else {
                continuo = false
            }

            return continuo;
        } catch (error) {
            console.error('Error al validar la continuidad del descanso médico:', error);
            // En caso de error, retornamos false para evitar registros incorrectos.
            return false;
        }
    }

    /**
     * Crea un descanso médico
     * @param {IDescansoMedico} data - Los datos del descanso médico a crear
     * @returns {Promise<DescansoMedicoResponse>} Respuesta con el descanso médico creado o error
     */
    async create(data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        // console.log('data descanso médico create', data)

        const {
            id_colaborador,
            id_usuario,
            fecha_inicio,
            fecha_final
        } = data

        // console.log('fecha_inicio create data one descanso', fecha_inicio)
        // console.log('fecha_final create data one descanso', fecha_final)

        const idColaborador = id_colaborador as string
        const fechaInicio = fecha_inicio as string
        const fechaFinal = fecha_final as string

        const esContinuo = await this.isDescansoConsecutivo(idColaborador, fechaInicio)

        console.log('---- validando si continuo ----')
        console.log({ esContinuo })

        data.total_dias = HDate.differenceDates(fechaInicio, fechaFinal) + 1

        const [
            anioFechaInicio,
            mesFechaInicio,
            diaFechaInicio
        ] = fechaInicio.split("-") as string[]

        const [
            anioFechaFinal,
            mesFechaFinal,
            diaFechaFinal
        ] = fechaFinal.split("-") as string[]

        // Obtener el mes de devengado
        const monthName = HDate.getMonthName(fechaFinal)

        const payload: IDescansoMedico = {
            ...data,
            is_continuo: esContinuo,
            dia_fecha_inicio: parseInt(diaFechaInicio, 10),
            mes_fecha_inicio: parseInt(mesFechaInicio, 10),
            anio_fecha_inicio: parseInt(anioFechaInicio, 10),
            dia_fecha_final: parseInt(diaFechaFinal, 10),
            mes_fecha_final: parseInt(mesFechaFinal, 10),
            anio_fecha_final: parseInt(anioFechaFinal, 10),
            mes_devengado: monthName,
            user_crea: id_usuario
        }

        // console.log('payload new descanso médico', payload)

        try {
            const newDescanso = await DescansoMedico.create(payload)

            if (!newDescanso || !newDescanso.id) {
                return {
                    result: false,
                    error: 'Error al registrar el descanso médico',
                    data: [],
                    status: 500
                };
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
     * Crea múltiples descansos médicos dentro de una transacción
     * @param {IDescansoMedico[]} dataArray - Un array de datos de registros médicos
     * @returns {Promise<DescansoMedicoResponse[]>} Un array de respuestas por cada creación
     */
    async createMultiple(dataArray: IDescansoMedico[]): Promise<DescansoMedicoResponse[]> {
        const transaction = await sequelize.transaction()
        const results: DescansoMedicoResponse[] = []
        const esContinuo = true
        // console.log('registros para crear descansos', dataArray)

        try {
            // console.log('dataArray createMuliple descansos médicos')
            // console.log({ dataArray })

            for (const data of dataArray) {
                const {
                    id_usuario,
                    fecha_inicio,
                    fecha_final
                } = data

                console.log({ fecha_inicio })
                console.log({ fecha_final })

                const fechaInicio = fecha_inicio as string
                const fechaFinal = fecha_final as string

                // Obteniendo fecha de inicio, mes y año de fecha de inicio y fecha final
                const [
                    anioFechaInicio,
                    mesFechaInicio,
                    diaFechaInicio
                ] = fechaInicio.split("-") as string[]

                const [
                    anioFechaFinal,
                    mesFechaFinal,
                    diaFechaFinal
                ] = fechaFinal.split("-") as string[]

                // Obtener el mes de devengado
                const monthName = HDate.getMonthName(fechaFinal)

                data.total_dias = HDate.differenceDates(fechaInicio, fechaFinal) + 1

                const payload: IDescansoMedico = {
                    ...data,
                    is_continuo: esContinuo,
                    dia_fecha_inicio: parseInt(diaFechaInicio, 10),
                    mes_fecha_inicio: parseInt(mesFechaInicio, 10),
                    anio_fecha_inicio: parseInt(anioFechaInicio, 10),
                    dia_fecha_final: parseInt(diaFechaFinal, 10),
                    mes_fecha_final: parseInt(mesFechaFinal, 10),
                    anio_fecha_final: parseInt(anioFechaFinal, 10),
                    mes_devengado: monthName,
                    user_crea: id_usuario
                }

                // console.log('payload new descanso', payload)

                const newDescanso = await DescansoMedico.create(payload, { transaction })

                results.push({
                    result: true,
                    message: 'Descanso médico registrado con éxito',
                    data: newDescanso,
                    status: 200
                })
            }
            await transaction.commit()
            return results
        } catch (error) {
            await transaction.rollback()
            console.error("Error al registrar múltiples descansos médicos: ", error)
            return dataArray.map(() => ({
                result: false,
                error: 'Error al registrar al descanso médico',
                status: 500
            }))
        }
    }

    /**
     * Actualiza un descanso médico existente por su ID
     * @param {string} id - El ID del descanso médico a actualizar
     * @param {IDescansoMedico} data - Los nuevos datos del descanso médico
     * @returns {Promise<DescansoMedicoResponse>} Respuesta con el descanso médico actualizado o error
     */
    async update(id: string, data: IDescansoMedico): Promise<DescansoMedicoResponse> {
        // const transaction = await sequelize.transaction()

        try {
            // const descanso = await DescansoMedico.findByPk(id, { transaction })
            const descanso = await DescansoMedico.findByPk(id, {
                include: [
                    COLABORADOR_DM_INCLUDE
                ]
            })

            console.log({ descanso })

            if (!descanso) {
                // await transaction.rollback();
                return {
                    result: false,
                    data: [],
                    message: 'Descanso médico no encontrado',
                    status: 200
                }
            }

            const dataUpdateDescanso: Partial<IDescansoMedico> = data

            // const updatedDescanso = await descanso.update(dataUpdateDescanso, { transaction })
            const updatedDescanso = await descanso.update(dataUpdateDescanso)

            console.log({ updatedDescanso })

            // await transaction.commit()

            return {
                result: true,
                message: 'Descanso médico actualizado con éxito',
                data: updatedDescanso,
                status: 200
            }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Procesa un array de descansos médicos a crear y ajusta sus fechas para evitar solapamiento con registros existentes.
     * @param {IDescansoMedico[]} descansosToCreate - Un array de objetos IDescansoMedico a procesar.
     * @returns {Promise<IDescansoMedico[]>} - El array de descansos médicos con las fechas ajustadas.
     */
    async validateSolapamientoFechas(descansosToCreate: IDescansoMedico[]): Promise<IDescansoMedico[]> {
        const processedDescansos: IDescansoMedico[] = [];

        for (const newDescanso of descansosToCreate) {
            const { id_colaborador, fecha_inicio, fecha_final } = newDescanso;

            const idColaborador = id_colaborador as string
            const fechaInicio = fecha_inicio as string
            const fechaFinal = fecha_final as string

            // Asegurar que las fechas existan antes de la consulta.
            if (!fecha_inicio || !fecha_final) {
                // Si faltan fechas, no se puede validar, se salta o se maneja el error.
                // En este caso, simplemente se añade al array para su posterior procesamiento.
                processedDescansos.push(newDescanso);
                continue;
            }

            const descansosExistentes = await this.buscarDescansosExistentes(idColaborador, fechaInicio, fechaFinal)

            if (descansosExistentes.length > 0) {
                let adjustedStartDate = new Date(fechaInicio);

                let adjustedEndDate = new Date(fechaFinal);

                descansosExistentes.forEach(descanso => {
                    const existingStart = new Date(descanso.fecha_inicio as string);

                    const existingEnd = new Date(descanso.fecha_final as string);

                    if (adjustedStartDate >= existingStart && adjustedStartDate <= existingEnd) {
                        adjustedStartDate.setDate(existingEnd.getDate() + 1);
                    }

                    if (adjustedEndDate >= existingStart && adjustedEndDate <= existingEnd) {
                        adjustedEndDate.setDate(existingStart.getDate() - 1);
                    }
                });

                if (adjustedStartDate <= adjustedEndDate) {
                    const newFechaInicio: string = adjustedStartDate.toISOString().split("T")[0]
                    const newFechaFinal: string = adjustedEndDate.toISOString().split("T")[0]

                    newDescanso.fecha_inicio = newFechaInicio
                    newDescanso.fecha_final = newFechaFinal
                    newDescanso.total_dias = HDate.differenceDates(newFechaInicio, newFechaFinal) + 1

                    processedDescansos.push(newDescanso);
                }
            } else {
                processedDescansos.push(newDescanso);
            }
        }

        // console.log({ processedDescansos })

        return processedDescansos;
    }

    async buscarDescansosExistentes(idColaborador: string, fechaInicio: string, fechaFinal: string): Promise<DescansoMedico[]> {
        const sqlQuery = `
            SELECT id, fecha_inicio, fecha_final
            FROM descanso_medico AS dm
            WHERE dm.deleted_at IS NULL
                AND dm.id_colaborador = :idColaborador
                AND dm.fecha_inicio <= :fechaFinal
                AND dm.fecha_final >= :fechaInicio
        `

        const descansos = await sequelize.query<DescansoMedico>(sqlQuery, {
            replacements: {
                idColaborador,
                fechaInicio,
                fechaFinal
            },
            type: QueryTypes.SELECT,
            model: DescansoMedico,
            mapToModel: true
        });

        return descansos
    }

    async getDescansosReport(): Promise<TReportDescansosResponse> {
        try {
            let descansos: IDescansoMedico[] = []

            descansos = await DescansoMedico.findAll({
                attributes: DESCANSOMEDICO_ATTRIBUTES,
                include: [
                    COLABORADOR_DM_INCLUDE,
                    // TIPODM_INCLUDE,
                    // TIPO_CONTINGENCIA_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ],
                order: [
                    ['fecha_otorgamiento', 'ASC']
                ]
            })

            // if (startDate && endDate) {
            //     descansos = await DescansoMedico.findAll({
            //         where: {
            //             fecha_inicio: {
            //                 [Op.between]: [startDate, endDate]
            //             }
            //         },
            //         attributes: DESCANSOMEDICO_ATTRIBUTES,
            //         include: [
            //             TIPODM_INCLUDE,
            //             TIPO_CONTINGENCIA_INCLUDE,
            //             DIAGNOSTICO_INCLUDE
            //         ]
            //     })
            // } else {
            //     descansos = await DescansoMedico.findAll({
            //         attributes: DESCANSOMEDICO_ATTRIBUTES,
            //         include: [
            //             TIPODM_INCLUDE,
            //             TIPO_CONTINGENCIA_INCLUDE,
            //             DIAGNOSTICO_INCLUDE
            //         ]
            //     })
            // }

            console.log('report descansos')
            console.log({ descansos })

            // Mapear los datos para el reporte
            const data = descansos.map(descanso => ({
                nombre_colaborador: descanso.nombre_colaborador,
                fecha_otorgamiento: descanso.fecha_otorgamiento,
                fecha_inicio: descanso.fecha_inicio,
                fecha_final: descanso.fecha_final,
                total_dias: descanso.total_dias,
                tipo_descansomedico: descanso.nombre_tipodescansomedico,
                tipo_contingencia: descanso.nombre_tipocontingencia,
                mes_devengado: descanso.mes_devengado,
                codigo_citt: descanso.codigo_citt
            }))

            const descansosReport = data as TItemReportDescansos[]

            return {
                result: true,
                data: descansosReport,
                message: "Descansos obtenidos correctamente",
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

            return {
                result: false,
                data: [],
                error: errorMessage,
                status: 500
            }
        }
    }

    async getDescansosWithCanjesReports(): Promise<TReportCanjesResponse> {
        try {
            let descansos: IDescansoMedico[] = []

            descansos = await DescansoMedico.findAll({
                attributes: DESCANSOMEDICO_ATTRIBUTES,
                include: [
                    COLABORADOR_DM_INCLUDE,
                    // TIPODM_INCLUDE,
                    // TIPO_CONTINGENCIA_INCLUDE,
                    DIAGNOSTICO_INCLUDE,
                    {
                        model: Canje,
                        as: 'canje'
                    }
                ],
                order: [
                    ['fecha_otorgamiento', 'ASC']
                ]
            })

            console.log({ descansos })

            // Mapear los datos para el reporte
            const data = descansos.map(descanso => ({
                numero_documento: descanso.colaborador_dm?.numero_documento,
                nombre_colaborador: descanso.nombre_colaborador,
                fecha_ingreso: HDate.formatDate(descanso.colaborador_dm?.fecha_ingreso, "dd/MM/yyyy"),
                puesto: descanso.colaborador_dm?.nombre_area,
                sede: descanso.colaborador_dm?.nombre_sede,
                mes_devengado_dm: descanso.mes_devengado,
                tipo_contingencia: descanso.nombre_tipocontingencia,
                fecha_inicio_dm: HDate.formatDate(descanso.fecha_inicio, "dd/MM/yyyy"),
                fecha_final_dm: HDate.formatDate(descanso.fecha_final, "dd/MM/yyyy"),
                total_dias_dm: descanso.total_dias,
                fecha_inicio_subsidio: (descanso.canje && descanso.canje.is_reembolsable ? HDate.formatDate(descanso.canje.fecha_inicio_subsidio, "dd/MM/yyyy") : ""),
                fecha_final_subsidio: (descanso.canje && descanso.canje.is_reembolsable ? HDate.formatDate(descanso.canje.fecha_final_subsidio, "dd/MM/yyyy") : ""),
                total_dias: (descanso.canje && descanso.canje.is_reembolsable ? descanso.canje.total_dias : "")
            }))

            const descansosReport = data as TItemReportSubsidios[]

            return {
                result: true,
                data: descansosReport,
                message: "Descansos obtenidos correctamente",
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

            return {
                result: false,
                data: [],
                error: errorMessage,
                status: 500
            }
        }
    }
}

// export default new DescansoMedicoRepository()

export default DescansoMedicoRepository;