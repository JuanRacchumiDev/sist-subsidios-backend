import { addDays, parseISO } from "date-fns"
import {
    CanjeResponse,
    CanjeResponsePaginate,
    ICanje,
    ICanjePaginate
} from "../../interfaces/Canje/ICanje"
import { Canje } from "../../models/Canje"
import sequelize from "../../../config/database"
import { CANJE_ATTRIBUTES } from "../../../constants/CanjeConstant"
import HPagination from "../../../helpers/HPagination"
import { Op, literal, fn, col, WhereOptions } from "sequelize"
import { DESCANSOMEDICO_INCLUDE } from "../../../includes/DescansoMedicoInclude"
import HDate from "../../../helpers/HDate"
import { ICanjeFilter } from "../../interfaces/Canje/ICanjeFilter"
import { TItemReport } from '../../types/Canje/TItemReport'
import { COLABORADOR_INCLUDE } from "../../../includes/ColaboradorInclude"
import { DescansoMedico } from "../../models/DescansoMedico"
import { Persona } from "../../models/Persona"

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
                    COLABORADOR_INCLUDE
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

    async getAllPaginate(
        page: number,
        limit: number,
        filters: ICanjeFilter = {}
    ): Promise<CanjeResponsePaginate> {
        try {
            const offset = HPagination.getOffset(page, limit);

            const {
                id_tipodescansomedico,
                id_tipocontingencia,
                id_empresa,
                nombre_colaborador,
                fecha_inicio_subsidio,
                fecha_final_subsidio
            } = filters;

            // Filtros para la tabla Canje
            const whereCanje: WhereOptions = {};

            if (fecha_inicio_subsidio && !fecha_final_subsidio) {
                whereCanje.fecha_inicio_subsidio = { [Op.gte]: fecha_inicio_subsidio };
            } else if (!fecha_inicio_subsidio && fecha_final_subsidio) {
                whereCanje.fecha_final_subsidio = { [Op.lte]: fecha_final_subsidio };
            } else if (fecha_inicio_subsidio && fecha_final_subsidio) {
                whereCanje.fecha_inicio_subsidio = { [Op.gte]: fecha_inicio_subsidio };
                whereCanje.fecha_final_subsidio = { [Op.lte]: fecha_final_subsidio };
            }

            // Filtros para DescansoMedico
            const whereDescansoMedico: WhereOptions = {};

            if (id_tipodescansomedico) {
                whereDescansoMedico.id_tipodescansomedico = id_tipodescansomedico;
            }

            if (id_tipocontingencia) {
                whereDescansoMedico.id_tipocontingencia = id_tipocontingencia;
            }

            if (id_empresa) {
                whereDescansoMedico.id_empresa = id_empresa;
            }

            // Filtros para Persona (Colaborador)
            let wherePersona: WhereOptions | undefined = undefined;

            if (nombre_colaborador) {
                wherePersona = {
                    [Op.or]: [
                        { nombres: { [Op.iLike]: `%${nombre_colaborador}%` } },
                        { apellido_paterno: { [Op.iLike]: `%${nombre_colaborador}%` } },
                        { apellido_materno: { [Op.iLike]: `%${nombre_colaborador}%` } }
                    ]
                };
            }

            const { rows, count: total } = await Canje.findAndCountAll({
                where: whereCanje,
                limit,
                offset,
                distinct: true,
                include: [
                    {
                        model: DescansoMedico,
                        as: 'descansoMedico',
                        required: Object.keys(whereDescansoMedico).length > 0,
                        where: Object.keys(whereDescansoMedico).length > 0 ? whereDescansoMedico : undefined
                    },
                    {
                        model: Persona,
                        as: 'colaborador',
                        required: !!wherePersona,
                        where: wherePersona
                    }
                ],
                order: [
                    [{ model: Persona, as: 'colaborador' }, 'apellido_paterno', 'ASC'],
                    ['fecha_inicio_subsidio', 'ASC']
                ]
            });

            const totalPages = Math.ceil(total / limit);
            const nextPage = HPagination.getNextPage(page, limit, total);
            const previousPage = HPagination.getPreviousPage(page);

            const pagination: ICanjePaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: total,
                nextPage,
                previousPage
            };

            return {
                result: true,
                data: rows as unknown as ICanje[],
                pagination,
                status: 200
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
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
                    COLABORADOR_INCLUDE
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

                console.log('payload new canje')
                console.log({ payload })

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
     * @param type - El tipo de reporte a ejecutar: 
     * 'no_consecutivos' (90 días) | 'consecutivos' (150 días) | 'global' (340 días)
     * @param limit - El límite de días a superar.
     * @returns {Promise<TReportResponse>} - Respuesta con la lista de canjes de los colaboradores identificados.
     */
    async getSubsidiosOverLimit(
        type: 'no_consecutivos' | 'consecutivos' | 'global',
        limit: number
    ): Promise<TReportResponse> {
        try {
            let havingCondition: string;

            // 1. Definir la cláusula HAVING para filtrar colaboradores por acumulación de días.
            switch (type) {
                case 'no_consecutivos':
                    // Reporte 1: > 90 días NO CONSECUTIVOS (is_continuo = false / 0)
                    havingCondition = `SUM(CASE WHEN "Canje"."is_continuo" = false THEN "Canje"."total_dias" ELSE 0 END) > ${limit}`;
                    break;
                case 'consecutivos':
                    // Reporte 2: > 150 días CONSECUTIVOS (is_continuo = true / 1)
                    havingCondition = `SUM(CASE WHEN "Canje"."is_continuo" = true THEN "Canje"."total_dias" ELSE 0 END) > ${limit}`;
                    break;
                case 'global':
                    // Reporte 3: > 340 días TOTALES
                    havingCondition = `SUM("Canje"."total_dias") > ${limit}`;
                    break;
                default:
                    return { result: false, message: 'Tipo de reporte inválido.', status: 400 };
            }

            // Definiciones de agregación para incluir las sumas como metadata en la primera consulta
            const aggregations = [
                // Suma de Días No Consecutivos (para el reporte 1)
                [
                    literal(`SUM(CASE WHEN "Canje"."is_continuo" = false THEN "Canje"."total_dias" ELSE 0 END)`),
                    TOTAL_DIAS_NO_CONSECUTIVOS
                ],
                // Suma de Días Consecutivos (para el reporte 2)
                [
                    literal(`SUM(CASE WHEN "Canje"."is_continuo" = true THEN "Canje"."total_dias" ELSE 0 END)`),
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
                having: literal(havingCondition), // Aplicar el filtro de acumulación de días
                // logging: console.log
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
                    COLABORADOR_INCLUDE
                ],
                order: [
                    ['id_colaborador', 'ASC'],
                    ['fecha_inicio_subsidio', 'ASC']
                ],
                // logging: console.log
            });

            console.log({ finalCanjes })

            const canjesWithMetadata = finalCanjes.map(canje => {
                const plainCanje = canje.get({ plain: true })

                const { colaborador } = plainCanje

                return {
                    numero_documento: colaborador?.numero_documento || "--",
                    nombre_colaborador: canje.nombre_colaborador,
                    fecha_otorgamiento: HDate.formatDate(canje.fecha_otorgamiento, "dd/MM/yyyy"),
                    fecha_inicio_subsidio: HDate.formatDate(canje.fecha_inicio_subsidio, "dd/MM/yyyy"),
                    fecha_fin_subsidio: HDate.formatDate(canje.fecha_final_subsidio, "dd/MM/yyyy"),
                    total_dias: canje.total_dias,
                    fecha_maxima_canje: HDate.formatDate(canje.fecha_maxima_canje, "dd/MM/yyyy"),
                    nombre_tipodescanso: canje.nombre_tipodescansomedico,
                    nombre_tipocontingencia: canje.nombre_tipocontingencia,
                    mes_devengado: canje.mes_devengado
                }
            })

            console.log({ canjesWithMetadata })

            const canjesReport = canjesWithMetadata as TItemReport[]

            console.log({ canjesReport })

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