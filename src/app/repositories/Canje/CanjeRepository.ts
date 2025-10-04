import { addDays, parseISO } from "date-fns"
import {
    CanjeResponse,
    CanjeResponsePaginate,
    ICanje,
    ICanjePaginate
} from "../../interfaces/Canje/ICanje"
import { Canje } from "../../models/Canje"
import { DescansoMedico } from "../../models/DescansoMedico"
import sequelize from "../../../config/database"
import { CANJE_ATTRIBUTES } from "../../../constants/CanjeConstant"
import HPagination from "../../../helpers/HPagination"
import { Op, Transaction, WhereOptions, literal, fn, col } from "sequelize"
import { DESCANSOMEDICO_INCLUDE } from "../../../includes/DescansoMedicoInclude"
import HDate from "../../../helpers/HDate"
import { COLABORADOR_INCLUDE } from "../../../includes/ColaboradorInclude"
import { ICanjeFilter } from "../../interfaces/Canje/ICanjeFilter"
import { TItemReport } from '../../types/Canje/TItemReport'

type TReportResponse = {
    result: boolean
    message?: string
    data?: TItemReport | TItemReport[]
    error?: string
    status?: number
}

const TOTAL_DIAS_NO_CONSECUTIVOS = 'total_dias_no_consecutivos';
const TOTAL_DIAS_CONSECUTIVOS = 'total_dias_consecutivos';
const TOTAL_DIAS_GLOBAL = 'total_dias_global';

class CanjeRepository {
    /**
     * Obtiene todos los canjes
     * @returns {Promise<CanjeResponse>}
     */
    async getAll(): Promise<CanjeResponse> {
        try {
            const canjes = await Canje.findAll({
                attributes: CANJE_ATTRIBUTES,
                include: [
                    DESCANSOMEDICO_INCLUDE,
                    // COLABORADOR_INCLUDE
                ],
                where: {
                    is_reembolsable: true
                },
                order: [
                    ['fecha_inicio_dm', 'ASC'],
                    ['fecha_inicio_subsidio', 'ASC']
                ]
            })

            return { result: true, data: canjes, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(
        page: number,
        limit: number,
        filters: ICanjeFilter
    ): Promise<CanjeResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            // Construcción dinámica de la claúsula WHERE
            const where: WhereOptions = {}

            where.is_reembolsable = true

            // Filtro por estado
            if (filters.estado !== undefined) {
                where.estado = filters.estado
            }

            // Filtro por nombre del colaborador
            if (filters.nombre_colaborador) {
                where.nombre_colaborador = {
                    [Op.like]: `%${filters.nombre_colaborador}%`
                }
            }

            // Filtro por rango de fechas
            if (filters.fecha_inicio_subsidio && filters.fecha_final_subsidio) {
                where.fecha_inicio_subsidio = {
                    [Op.lte]: filters.fecha_final_subsidio
                }

                where.fecha_final_subsidio = {
                    [Op.gte]: filters.fecha_inicio_subsidio
                }

                /**
                 where.fecha_inicio_subsidio = {
                    [Op.between]: [filters.fecha_inicio_subsidio, filters.fecha_final_subsidio]
                 }
                 */
            } else if (filters.fecha_inicio_subsidio) {
                where.fecha_inicio_subsidio = {
                    [Op.gte]: filters.fecha_inicio_subsidio
                }
            } else if (filters.fecha_final_subsidio) {
                where.fecha_final_subsidio = {
                    [Op.lte]: filters.fecha_final_subsidio
                }
            }

            const { count, rows } = await Canje.findAndCountAll({
                attributes: CANJE_ATTRIBUTES,
                include: [
                    DESCANSOMEDICO_INCLUDE,
                    // COLABORADOR_INCLUDE
                ],
                where,
                // where: {
                //     is_reembolsable: true
                // },
                order: [
                    ['fecha_inicio_dm', 'ASC'],
                    ['fecha_inicio_subsidio', 'ASC']
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
                include: [
                    DESCANSOMEDICO_INCLUDE,
                    // COLABORADOR_INCLUDE
                ]
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
     * Valida si un nuevo canje es consecutivo al anterior
     * @param {string} idColaborador - El ID del colaborador 
     * @param {string} fechaInicioNuevo - La fecha de inicio del nuevo canje (formato 'YYYY-MM-DD')
     * @returns {Promise<boolean>} Retorna true si es consecutivo o si no hay registros previos, de lo contrario false 
     */
    async isCanjeConsecutivo(idColaborador: string, fechaInicioNuevo: string): Promise<boolean> {
        try {
            const ultimoCanje = await Canje.findOne({
                where: { id_colaborador: idColaborador },
                order: [
                    ['fecha_final_subsidio', 'DESC']
                ],
                limit: 1
            });

            if (!ultimoCanje) {
                return true
            }

            const { fecha_final_subsidio } = ultimoCanje

            const fechaFinalSubsidio = fecha_final_subsidio as string

            // Convertir las fechas a objetoss Date
            const fechaFinalAnterior = parseISO(fechaFinalSubsidio)

            const fechaInicioNueva = parseISO(fechaInicioNuevo)

            // Sumar 1 día a la fecha final del canje anterior
            const diaSiguiente = addDays(fechaFinalAnterior, 1)

            console.log('fechaFinalAnterior', fechaFinalAnterior)
            console.log('fechaInicioNueva', fechaInicioNueva)
            console.log('diaSiguiente', diaSiguiente)
            console.log('fechaInicioNueva.getTime()', fechaInicioNueva.getTime())
            console.log('diaSiguiente.getTime()', diaSiguiente.getTime())

            // Comparar si la nueva fecha de inicio es igual al día siguiente de la fecha final anterior.
            // Para la comparación, solo nos interesa la fecha, no la hora, lo cual parseISO ya maneja.
            const esMismoDia = fechaInicioNueva.getTime() === diaSiguiente.getTime();

            console.log({ esMismoDia })

            return esMismoDia;
        } catch (error) {
            console.error('Error al validar la continuidad del canje:', error);
            // En caso de error, retornamos false para evitar registros incorrectos.
            return false;
        }
    }

    /**
     * Crea un canje
     * @param {ICanje} data - Los datos del canje a crear
     * @returns {Promise<CanjeResponse>} Respuesta con el canje creado o error
     */
    async create(data: ICanje): Promise<CanjeResponse> {
        const {
            id_colaborador,
            fecha_inicio_subsidio,
            fecha_final_subsidio,
        } = data

        console.log('fecha_inicio_subsidio create data one descanso', fecha_inicio_subsidio)
        console.log('fecha_final_subsidio create data one descanso', fecha_final_subsidio)

        const idColaborador = id_colaborador as string
        const fechaInicioSubsidio = fecha_inicio_subsidio as string
        const fechaFinalSubsidio = fecha_final_subsidio as string

        const esContinuo = await this.isCanjeConsecutivo(idColaborador, fechaInicioSubsidio)

        console.log({ esContinuo })

        data.total_dias = HDate.differenceDates(fechaInicioSubsidio, fechaFinalSubsidio) + 1

        const [
            anioFechaInicioSubsidio,
            mesFechaInicioSubsidio,
            diaFechaInicioSubsidio
        ] = fechaInicioSubsidio.split("-") as string[]

        const [
            anioFechaFinalSubsidio,
            mesFechaFinalSubsidio,
            diaFechaFinalSubsidio
        ] = fechaFinalSubsidio.split("-") as string[]

        // Obtener el mes de devengado
        const monthName = HDate.getMonthName(fechaFinalSubsidio)

        const payload: ICanje = {
            ...data,
            is_continuo: esContinuo,
            dia_fecha_inicio_subsidio: parseInt(diaFechaInicioSubsidio, 10),
            mes_fecha_inicio_subsidio: parseInt(mesFechaInicioSubsidio, 10),
            anio_fecha_inicio_subsidio: parseInt(anioFechaInicioSubsidio, 10),
            dia_fecha_final_subsidio: parseInt(diaFechaFinalSubsidio, 10),
            mes_fecha_final_subsidio: parseInt(mesFechaFinalSubsidio, 10),
            anio_fecha_final_subsidio: parseInt(anioFechaFinalSubsidio, 10),
            mes_devengado: monthName
        }

        try {
            // const newCanje = await Canje.create(data, { transaction })
            const newCanje = await Canje.create(payload)

            // const { id: idCanje } = newCanje

            if (!newCanje || !newCanje.id) {
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
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea múltiples canjes dentro de una transacción
     * @param {ICanje[]} dataArray - Un array de datos de canjes
     * @returns {Promise<CanjeResponse[]>} Un array de respuestas por cada creación
     */
    async createMultiple(dataArray: ICanje[]): Promise<CanjeResponse[]> {
        const transaction = await sequelize.transaction()

        const results: CanjeResponse[] = []

        // console.log('registros para crear descansos', dataArray)

        try {
            for (const data of dataArray) {
                const {
                    id_colaborador,
                    fecha_inicio_subsidio,
                    fecha_final_subsidio,
                } = data

                // console.log({ esContinuo })

                const idColaborador = id_colaborador as string
                const fechaInicioSubsidio = fecha_inicio_subsidio as string
                const fechaFinalSubsidio = fecha_final_subsidio as string

                const esContinuo = await this.isCanjeConsecutivo(idColaborador, fechaInicioSubsidio)

                console.log({ esContinuo })

                const [
                    anioFechaInicioSubsidio,
                    mesFechaInicioSubsidio,
                    diaFechaInicioSubsidio
                ] = fechaInicioSubsidio.split("-") as string[]

                const [
                    anioFechaFinalSubsidio,
                    mesFechaFinalSubsidio,
                    diaFechaFinalSubsidio
                ] = fechaFinalSubsidio.split("-") as string[]

                // Obtener el mes de devengado
                const monthName = HDate.getMonthName(fechaFinalSubsidio)

                data.total_dias = HDate.differenceDates(fechaInicioSubsidio, fechaFinalSubsidio) + 1

                const payload: ICanje = {
                    ...data,
                    is_continuo: esContinuo,
                    dia_fecha_inicio_subsidio: parseInt(diaFechaInicioSubsidio, 10),
                    mes_fecha_inicio_subsidio: parseInt(mesFechaInicioSubsidio, 10),
                    anio_fecha_inicio_subsidio: parseInt(anioFechaInicioSubsidio, 10),
                    dia_fecha_final_subsidio: parseInt(diaFechaFinalSubsidio, 10),
                    mes_fecha_final_subsidio: parseInt(mesFechaFinalSubsidio, 10),
                    anio_fecha_final_subsidio: parseInt(anioFechaFinalSubsidio, 10),
                    mes_devengado: monthName
                }

                const newCanje = await Canje.create(payload, { transaction })

                results.push({
                    result: true,
                    message: 'Canje registrado con éxito',
                    data: newCanje,
                    status: 200
                })
            }
            await transaction.commit()
            return results
        } catch (error) {
            await transaction.rollback()
            console.error("Error al registrar múltiples canjes: ", error)
            return dataArray.map(() => ({
                result: false,
                error: 'Error al registrar el canje',
                status: 500
            }))
        }
    }

    /**
     * Actualiza un canje existente por su ID
     * @param {string} id - El ID del canje a actualizar
     * @param {ICanje} data - Los nuevos datos del canje
     * @returns {Promise<CanjeResponse>} Respuesta con el canje actualizado o error
     */
    async update(id: string, data: ICanje): Promise<CanjeResponse> {
        // const transaction = await sequelize.transaction()

        try {
            // const canje = await Canje.findByPk(id, { transaction })
            const canje = await Canje.findByPk(id, {
                attributes: CANJE_ATTRIBUTES,
                include: [DESCANSOMEDICO_INCLUDE]
            })

            if (!canje) {
                // await transaction.rollback();
                return {
                    result: false,
                    data: [],
                    message: 'Canje no encontrado',
                    status: 200
                }
            }

            const dataUpdateCanje: Partial<ICanje> = data

            // const updatedCanje = await canje.update(dataUpdateCanje, { transaction })
            const updatedCanje = await canje.update(dataUpdateCanje)

            // await transaction.commit()

            return { result: true, message: 'Canje actualizado con éxito', data: updatedCanje, status: 200 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * 
     * @param {string} idColaborador - El ID del colaborador 
     * @param fechaInicio - La fecha de inicio del nuevo canje
     * @param fechaFinal - La fecha de final del nuevo canje
     * @returns {Promise<{fechaInicio: string, fechaFinal: string} | null>} - Un objeto con las fechas ajustadas
     */
    async validateAcoplamiento(
        idColaborador: string,
        fechaInicio: string,
        fechaFinal: string
    ): Promise<{ fechaInicio: string, fechaFinal: string } | null> {
        try {
            const nuevaFechaInicio = new Date(fechaInicio);
            const nuevaFechaFinal = new Date(fechaFinal);

            // console.log({ nuevaFechaInicio })
            // console.log({ nuevaFechaFinal })

            // Buscar descansos médicos existentes para el colaborador que se solapen con el nuevo registro.
            const canjesExistentes = await Canje.findAll({
                where: {
                    id_colaborador: idColaborador,
                    [Op.and]: [
                        {
                            fecha_inicio_subsidio: {
                                [Op.lte]: nuevaFechaFinal
                            }
                        },
                        {
                            fecha_final_subsidio: {
                                [Op.gte]: nuevaFechaInicio
                            }
                        }
                    ]
                },
                order: [
                    ['fecha_inicio_subsidio', 'ASC']
                ]
            }) as Canje[]

            // console.log({ canjesExistentes })

            // Si no hay solapamiento, no hay que hacer nada, se puede guardar el registro tal cual
            if (canjesExistentes.length === 0) {
                // console.log('no hay solapamiento')
                return { fechaInicio, fechaFinal };
            }

            // Si hay solapamiento, ajusta las fechas
            let fechaInicioAjustada = nuevaFechaInicio;
            let fechaFinalAjustada = nuevaFechaFinal;

            // Ordena los canjes existentes por fecha de inicio de subsidio para procesarlos en orden
            // canjesExistentes.sort((a, b) => new Date(a.fecha_inicio_subsidio) - new Date(b.fecha_inicio_subsidio));

            // Procesa cada solapamiento y ajusta las fechas del nuevo registro
            for (const canje of canjesExistentes) {
                // Se verifica que las fechas existan antes de convertirlas a tipo Date
                const fechaInicioExistente = canje.fecha_inicio_subsidio ? new Date(canje.fecha_inicio_subsidio) : null;
                const fechaFinalExistente = canje.fecha_final_subsidio ? new Date(canje.fecha_final_subsidio) : null;

                // Continúa con la lógica solo si las fechas existen
                if (fechaInicioExistente && fechaFinalExistente) {
                    // Caso 1: Nuevo canje totalmente cubierto por uno existente
                    if (fechaInicioAjustada >= fechaInicioExistente && fechaFinalAjustada <= fechaFinalExistente) {
                        // console.log('aa')
                        return null;
                    }

                    // Caso 2: El nuevo canje se solapa al inicio
                    if (fechaInicioAjustada >= fechaInicioExistente && fechaInicioAjustada <= fechaFinalExistente) {
                        // console.log('bb')
                        fechaInicioAjustada = new Date(fechaFinalExistente);
                        fechaInicioAjustada.setDate(fechaInicioAjustada.getDate() + 1);
                    }

                    // Caso 3: El nuevo canje se solapa al final
                    if (fechaFinalAjustada >= fechaInicioExistente && fechaFinalAjustada <= fechaFinalExistente) {
                        // console.log('cc')
                        fechaFinalAjustada = new Date(fechaInicioExistente);
                        fechaFinalAjustada.setDate(fechaFinalAjustada.getDate() - 1);
                    }
                }
            }

            // Si las fechas ajustadas son válidas (fecha de inicio de subsidio es anterior a la fecha de finalización), devuélvelas
            if (fechaInicioAjustada <= fechaFinalAjustada) {
                // console.log('dd')
                return {
                    fechaInicio: fechaInicioAjustada.toISOString().split('T')[0],
                    fechaFinal: fechaFinalAjustada.toISOString().split('T')[0]
                };
            } else {
                // console.log('ee')
                return null; // El ajuste resultó en un período inválido, lo que implica solapamiento total
            }
        } catch (error) {
            // console.log('ff')
            console.error("Error al validar y ajustar descanso canje:", error);
            return null
        }
    }

    /**
     * Procesa un array de canjes a crear y ajusta sus fechas para evitar solapamiento con registros existentes.
     * @param {ICanje[]} canjesToCreate - Un array de objetos ICanje a procesar.
     * @returns {Promise<ICanje[]>} - El array de canjes con las fechas ajustadas.
     */
    async validateSolapamientoFechas(canjesToCreate: ICanje[]): Promise<ICanje[]> {
        const processedCanjes: ICanje[] = [];

        for (const newCanje of canjesToCreate) {
            const { id_colaborador, fecha_inicio_subsidio, fecha_final_subsidio } = newCanje;

            const idColaborador = id_colaborador as string
            const fechaInicioSubsidio = fecha_inicio_subsidio as string
            const fechaFinalSubsidio = fecha_final_subsidio as string

            // Asegurar que las fechas existan antes de la consulta.
            if (!fecha_inicio_subsidio || !fecha_final_subsidio) {
                // Si faltan fechas, no se puede validar, se salta o se maneja el error.
                // En este caso, simplemente se añade al array para su posterior procesamiento.
                processedCanjes.push(newCanje);
                continue;
            }

            const existingCanjes = await Canje.findAll({
                where: {
                    id_colaborador: idColaborador,
                    [Op.or]: [
                        { // El canje existente empieza o termina dentro del nuevo canje
                            fecha_inicio_subsidio: { [Op.between]: [fecha_inicio_subsidio, fecha_final_subsidio] }
                        },
                        {
                            fecha_final_subsidio: { [Op.between]: [fecha_inicio_subsidio, fecha_final_subsidio] }
                        },
                        { // El nuevo canje está completamente dentro de un canje existente
                            [Op.and]: [
                                { fecha_inicio_subsidio: { [Op.lte]: fecha_inicio_subsidio } },
                                { fecha_final_subsidio: { [Op.gte]: fecha_final_subsidio } }
                            ]
                        }
                    ]
                }
            });

            if (existingCanjes.length > 0) {
                let adjustedStartDate = new Date(fechaInicioSubsidio);
                let adjustedEndDate = new Date(fechaFinalSubsidio);

                existingCanjes.forEach(existingCanje => {
                    const existingStart = new Date(existingCanje.fecha_inicio_subsidio as string);
                    const existingEnd = new Date(existingCanje.fecha_final_subsidio as string);

                    if (adjustedStartDate >= existingStart && adjustedStartDate <= existingEnd) {
                        adjustedStartDate.setDate(existingEnd.getDate() + 1);
                    }
                    if (adjustedEndDate >= existingStart && adjustedEndDate <= existingEnd) {
                        adjustedEndDate.setDate(existingStart.getDate() - 1);
                    }
                });

                if (adjustedStartDate <= adjustedEndDate) {
                    newCanje.fecha_inicio_subsidio = adjustedStartDate.toISOString().split("T")[0];
                    newCanje.fecha_final_subsidio = adjustedEndDate.toISOString().split("T")[0];
                    processedCanjes.push(newCanje);
                }
            } else {
                processedCanjes.push(newCanje);
            }
        }
        return processedCanjes;
    }

    /**
     * Obtiene canjes o subsidios que superan un límite de días de subsidio,
     * agrupando por colaborador de manera óptima en la BD.
     * * @param type - El tipo de reporte a ejecutar: 
     * 'non_consecutive' (90 días) | 'consecutive' (150 días) | 'global' (340 días)
     * @param limit - El límite de días a superar.
     * @returns {Promise<CanjeResponse>} - Respuesta con la lista de canjes de los colaboradores identificados.
     */
    async getSubsidiosOverLimit(
        type: 'non_consecutive' | 'consecutive' | 'global',
        limit: number
    ): Promise<CanjeResponse> {
        try {
            let havingCondition: string;

            // 1. Definir la cláusula HAVING para filtrar colaboradores por acumulación de días.
            switch (type) {
                case 'non_consecutive':
                    // Reporte 1: > 90 días NO CONSECUTIVOS (is_continuo = false / 0)
                    havingCondition = `SUM(CASE WHEN Canje.is_continuo = 0 THEN Canje.total_dias ELSE 0 END) > ${limit}`;
                    break;
                case 'consecutive':
                    // Reporte 2: > 150 días CONSECUTIVOS (is_continuo = true / 1)
                    havingCondition = `SUM(CASE WHEN Canje.is_continuo = 1 THEN Canje.total_dias ELSE 0 END) > ${limit}`;
                    break;
                case 'global':
                    // Reporte 3: > 340 días TOTALES
                    havingCondition = `SUM(Canje.total_dias) > ${limit}`;
                    break;
                default:
                    return { result: false, message: 'Tipo de reporte inválido.', status: 400 };
            }

            // Definiciones de agregación para incluir las sumas como metadata en la primera consulta
            const aggregations = [
                // Suma de Días No Consecutivos (para el reporte 1)
                [
                    literal(`SUM(CASE WHEN Canje.is_continuo = 0 THEN Canje.total_dias ELSE 0 END)`),
                    TOTAL_DIAS_NO_CONSECUTIVOS
                ],
                // Suma de Días Consecutivos (para el reporte 2)
                [
                    literal(`SUM(CASE WHEN Canje.is_continuo = 1 THEN Canje.total_dias ELSE 0 END)`),
                    TOTAL_DIAS_CONSECUTIVOS
                ],
                // Suma de Días Globales (para el reporte 3)
                [
                    fn('SUM', col('total_dias')),
                    TOTAL_DIAS_GLOBAL
                ]
            ];

            // 2. Consulta optimizada: Obtener IDs de colaboradores que superan el límite.
            const collaboratorsOverLimit = await Canje.findAll({
                attributes: [
                    'id_colaborador',
                    ...aggregations as any // Incluye las sumas para usarlas en la metadata del reporte final
                ],
                where: {
                    // Criterio para subsidio: is_reembolsable = true
                    is_reembolsable: true,
                    estado: true // Solo registros activos
                },
                group: ['id_colaborador'],
                having: literal(havingCondition) // Aplicar el filtro de acumulación de días
            });

            // 3. Extraer los IDs de colaboradores
            const colaboradorIds = collaboratorsOverLimit.map(c => (c.get('id_colaborador') as string));

            if (colaboradorIds.length === 0) {
                return {
                    result: true,
                    message: `Ningún colaborador con canjes subsidiados supera los ${limit} días (${type}).`,
                    data: [],
                    status: 200
                };
            }

            // 4. Obtener todos los registros de Canje para los colaboradores identificados.
            const finalCanjes = await Canje.findAll({
                attributes: CANJE_ATTRIBUTES,
                where: {
                    id_colaborador: {
                        [Op.in]: colaboradorIds // Filtrar por los IDs que cumplen la condición
                    },
                    estado: true
                },
                include: [
                    DESCANSOMEDICO_INCLUDE,
                    // COLABORADOR_INCLUDE
                ],
                order: [
                    ['id_colaborador', 'ASC'],
                    ['fecha_inicio_subsidio', 'ASC']
                ]
            });

            // 5. Enriquecer los datos: Adjuntar los totales calculados a cada registro.
            const canjesWithMetadata = finalCanjes.map(canje => ({
                // const collaboratorSummary = collaboratorsOverLimit.find(c => c.get('id_colaborador') === canje.id_colaborador);
                numero_documento: "--",
                nombre_colaborador: canje.nombre_colaborador,
                mes_devengado: canje.mes_devengado,
                nombre_tipodescansomedico: canje.nombre_tipodescansomedico,
                nombre_tipocontingencia: canje.nombre_tipocontingencia,
                fecha_otorgamiento: canje.fecha_otorgamiento,
                fecha_inicio_dm: canje.fecha_inicio_dm,
                fecha_final_dm: canje.fecha_final_dm,
                fecha_inicio_subsidio: canje.fecha_inicio_subsidio,
                fecha_final_subsidio: canje.fecha_final_subsidio,
                total_dias_subsidio: canje.total_dias,
                // return {
                //     ...canje.get({ plain: true }),
                //     // Campos de metadata para el reporte
                //     [TOTAL_DIAS_NO_CONSECUTIVOS]: collaboratorSummary ? collaboratorSummary.get(TOTAL_DIAS_NO_CONSECUTIVOS) : 0,
                //     [TOTAL_DIAS_CONSECUTIVOS]: collaboratorSummary ? collaboratorSummary.get(TOTAL_DIAS_CONSECUTIVOS) : 0,
                //     [TOTAL_DIAS_GLOBAL]: collaboratorSummary ? collaboratorSummary.get(TOTAL_DIAS_GLOBAL) : 0,
                // }
            }))
            // as ICanje[]; // El array resultante contiene ICanje con propiedades extra

            const canjesReport = canjesWithMetadata as TItemReport[]

            return {
                result: true,
                message: `Reporte de subsidios que superan ${limit} días (${type}) generado con éxito.`,
                data: canjesReport,
                status: 200
            };

        } catch (error) {
            console.error('Error al obtener el reporte de subsidios:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return {
                result: false,
                message: 'Ocurrió un error al generar el reporte.',
                error: errorMessage,
                status: 500
            };
        }
    }
}

// export default new CanjeRepository()

export default CanjeRepository