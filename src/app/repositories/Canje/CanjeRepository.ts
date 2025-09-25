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
import { Op, Transaction } from "sequelize"
import { DESCANSOMEDICO_INCLUDE } from "../../../includes/DescansoMedicoInclude"
import HDate from "../../../helpers/HDate"
import { COLABORADOR_INCLUDE } from "../../../includes/ColaboradorInclude"

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

    async getAllWithPaginate(page: number, limit: number): Promise<CanjeResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const { count, rows } = await Canje.findAndCountAll({
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
     * Crea un canje
     * @param {ICanje} data - Los datos del canje a crear
     * @returns {Promise<CanjeResponse>} Respuesta con el canje creado o error
     */
    async create(data: ICanje): Promise<CanjeResponse> {
        const {
            fecha_inicio_subsidio,
            fecha_final_subsidio,
        } = data

        const [
            anioFechaInicioSubsidio,
            mesFechaInicioSubsidio,
            diaFechaInicioSubsidio
        ] = (fecha_inicio_subsidio as string).split("-") as string[]

        const [
            anioFechaFinalSubsidio,
            mesFechaFinalSubsidio,
            diaFechaFinalSubsidio
        ] = (fecha_final_subsidio as string).split("-") as string[]

        data.total_dias = HDate.differenceDates(fecha_inicio_subsidio as string, fecha_final_subsidio as string) + 1

        // Obtener el mes de devengado
        const monthName = HDate.getMonthName(fecha_final_subsidio as string)

        const payload: ICanje = {
            ...data,
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
                    fecha_inicio_subsidio,
                    fecha_final_subsidio,
                } = data

                // console.log({ esContinuo })

                const [
                    anioFechaInicioSubsidio,
                    mesFechaInicioSubsidio,
                    diaFechaInicioSubsidio
                ] = (fecha_inicio_subsidio as string).split("-") as string[]

                const [
                    anioFechaFinalSubsidio,
                    mesFechaFinalSubsidio,
                    diaFechaFinalSubsidio
                ] = (fecha_final_subsidio as string).split("-") as string[]

                data.total_dias = HDate.differenceDates(fecha_inicio_subsidio as string, fecha_final_subsidio as string) + 1

                // Obtener el mes de devengado
                const monthName = HDate.getMonthName(fecha_final_subsidio as string)

                const payload: ICanje = {
                    ...data,
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

    // async generateCorrelativo(): Promise<string> {
    //     // const transaction = await sequelize.transaction();
    //     try {
    //         const anioActual = new Date().getFullYear()

    //         const prefijo = 'CANJ'

    //         const formatoCodigo = `${prefijo}-${anioActual}-%`

    //         // 1. Encontrar el último registro para el año actual
    //         const ultimoCanje = await Canje.findOne({
    //             where: {
    //                 codigo: {
    //                     [Op.like]: formatoCodigo
    //                 }
    //             },
    //             order: [
    //                 ['codigo', 'DESC']
    //             ],
    //             // transaction,
    //             // lock: transaction.LOCK.UPDATE
    //         })

    //         let nuevoNumero = 1;

    //         if (ultimoCanje) {

    //             const { codigo } = ultimoCanje

    //             const codigoStr = codigo as string

    //             // 2. Extraer y aumentar el número correlativo
    //             const [, , numero] = codigoStr.split('-') as string[];

    //             const ultimoNumero = parseInt(numero, 10);

    //             nuevoNumero = ultimoNumero + 1;
    //         }

    //         // 3. Formatear el nuevo correlativo
    //         const numeroFormateado = String(nuevoNumero).padStart(4, '0');

    //         const nuevoCorrelativo = `${prefijo}-${anioActual}-${numeroFormateado}`;

    //         // await transaction.commit();
    //         return nuevoCorrelativo;
    //     } catch (error) {
    //         // await transaction.rollback();
    //         console.error('Error al generar el correlativo:', error);
    //         throw new Error('No se pudo generar el correlativo del canje');
    //     }
    // }

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
                let adjustedStartDate = new Date(fecha_inicio_subsidio as string);
                let adjustedEndDate = new Date(fecha_final_subsidio as string);

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
                    // newCanje.fecha_inicio_subsidio = HDate.formatDate(adjustedStartDate);
                    // newCanje.fecha_final_subsidio = HDate.formatDate(adjustedEndDate);
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
}

// export default new CanjeRepository()

export default CanjeRepository