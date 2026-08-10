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
import { Op, literal, fn, col, WhereOptions, QueryTypes } from "sequelize"
import { DESCANSOMEDICO_INCLUDE } from "../../../includes/DescansoMedicoInclude"
import HDate from "../../../helpers/HDate"
import { ICanjeFilter } from "../../interfaces/Canje/ICanjeFilter"
import { TItemReport } from '../../types/Canje/TItemReport'
import { COLABORADOR_INCLUDE } from "../../../includes/ColaboradorInclude"
import { DescansoMedico } from "../../models/DescansoMedico"
import { Persona } from "../../models/Persona"

// type TReportResponse = {
//     result: boolean
//     message?: string
//     data?: TItemReport | TItemReport[]
//     error?: string
//     status?: number
// }

// const TOTAL_DIAS_NO_CONSECUTIVOS = 'total_dias_no_consecutivos';
// const TOTAL_DIAS_CONSECUTIVOS = 'total_dias_consecutivos';
// const TOTAL_DIAS_GLOBAL = 'total_dias_global';

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
     * Reporte 1: 90 Días No Consecutivos (is_continuo = FALSE)
     */
    async getReporte90DiasNoConsecutivos(fechaInicio?: string, fechaFinal?: string): Promise<TItemReport[]> {
        const { dateFilter, replacements } = this.buildDateFilter(fechaInicio, fechaFinal);

        const query = `
            SELECT 
                c.id_colaborador,
                c.nombre_colaborador,
                COALESCE(SUM(c.total_dias), 0)::INTEGER AS total_dias_acumulados,
                COUNT(c.id)::INTEGER AS cantidad_canjes,
                CASE WHEN COALESCE(SUM(c.total_dias), 0) >= 90 THEN TRUE ELSE FALSE END AS excede_limite
            FROM canje c
            WHERE 
                c.is_continuo = FALSE
                AND c.estado = TRUE
                AND c.deleted_at IS NULL
                ${dateFilter}
            GROUP BY 
                c.id_colaborador, 
                c.nombre_colaborador
            ORDER BY 
                c.nombre_colaborador ASC;
        `;

        return await sequelize.query<TItemReport>(query, {
            replacements,
            type: QueryTypes.SELECT
        });
    }

    /**
     * Reporte 2: 150 Días Consecutivos (is_continuo = TRUE)
     */
    async getReporte150DiasConsecutivos(fechaInicio?: string, fechaFinal?: string): Promise<TItemReport[]> {
        const { dateFilter, replacements } = this.buildDateFilter(fechaInicio, fechaFinal);

        const query = `
            SELECT 
                c.id_colaborador,
                c.nombre_colaborador,
                COALESCE(SUM(c.total_dias), 0)::INTEGER AS total_dias_acumulados,
                COUNT(c.id)::INTEGER AS cantidad_canjes,
                CASE WHEN COALESCE(SUM(c.total_dias), 0) >= 150 THEN TRUE ELSE FALSE END AS excede_limite
            FROM canje c
            WHERE 
                c.is_continuo = TRUE
                AND c.estado = TRUE
                AND c.deleted_at IS NULL
                ${dateFilter}
            GROUP BY 
                c.id_colaborador, 
                c.nombre_colaborador
            ORDER BY 
                c.nombre_colaborador ASC;
        `;

        return await sequelize.query<TItemReport>(query, {
            replacements,
            type: QueryTypes.SELECT
        });
    }

    /**
     * Reporte 3: 340 Días Globales (Sumatoria acumulada total independientemente de is_continuo)
     */
    async getReporte340DiasGlobales(fechaInicio?: string, fechaFinal?: string): Promise<TItemReport[]> {
        const { dateFilter, replacements } = this.buildDateFilter(fechaInicio, fechaFinal);

        const query = `
            SELECT 
                c.id_colaborador,
                c.nombre_colaborador,
                COALESCE(SUM(c.total_dias), 0)::INTEGER AS total_dias_acumulados,
                COUNT(c.id)::INTEGER AS cantidad_canjes,
                CASE WHEN COALESCE(SUM(c.total_dias), 0) >= 340 THEN TRUE ELSE FALSE END AS excede_limite
            FROM canje c
            WHERE 
                c.estado = TRUE
                AND c.deleted_at IS NULL
                ${dateFilter}
            GROUP BY 
                c.id_colaborador, 
                c.nombre_colaborador
            ORDER BY 
                c.nombre_colaborador ASC;
        `;

        return await sequelize.query<TItemReport>(query, {
            replacements,
            type: QueryTypes.SELECT
        });
    }

    /**
     * Método genérico parametrizado por tipo de reporte
     */
    async getSubsidiosOverLimit(
        type: 'no_consecutivos_90' | 'consecutivos_150' | 'global_340',
        fechaInicio?: string,
        fechaFinal?: string
    ): Promise<TItemReport[]> {
        switch (type) {
            case 'no_consecutivos_90':
                return await this.getReporte90DiasNoConsecutivos(fechaInicio, fechaFinal);
            case 'consecutivos_150':
                return await this.getReporte150DiasConsecutivos(fechaInicio, fechaFinal);
            case 'global_340':
                return await this.getReporte340DiasGlobales(fechaInicio, fechaFinal);
            default:
                throw new Error('Tipo de reporte no soportado');
        }
    }

    /**
     * Auxiliar para construir dinámicamente la cláusula WHERE de fechas para SQL nativo
     */
    private buildDateFilter(fechaInicio?: string, fechaFinal?: string, formatoFechaBD: string = 'YYYY-MM-DD') {
        let dateFilter = '';
        const replacements: Record<string, any> = { formatoFechaBD };

        if (fechaInicio && fechaFinal) {
            dateFilter = ` AND TO_DATE(c.fecha_inicio_subsidio, :formatoFechaBD) BETWEEN TO_DATE(:fechaInicio, :formatoFechaBD) AND TO_DATE(:fechaFinal, :formatoFechaBD)`;
            replacements.fechaInicio = fechaInicio;
            replacements.fechaFinal = fechaFinal;
        } else if (fechaInicio) {
            dateFilter = ` AND TO_DATE(c.fecha_inicio_subsidio, :formatoFechaBD) >= TO_DATE(:fechaInicio, :formatoFechaBD)`;
            replacements.fechaInicio = fechaInicio;
        } else if (fechaFinal) {
            dateFilter = ` AND TO_DATE(c.fecha_inicio_subsidio, :formatoFechaBD) <= TO_DATE(:fechaFinal, :formatoFechaBD)`;
            replacements.fechaFinal = fechaFinal;
        }

        return { dateFilter, replacements };
    }
}

// export default new CanjeRepository()

export default CanjeRepository