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
import { parseISO, addDays } from 'date-fns';
import { COLABORADOR_INCLUDE } from "../../../includes/ColaboradorInclude";
import { TIPODM_INCLUDE } from "../../../includes/TipoDescansoMedicoInclude";
import { TIPO_CONTINGENCIA_INCLUDE } from "../../../includes/TipoContingenciaInclude";
import { DIAGNOSTICO_INCLUDE } from "../../../includes/DiagnosticoInclude";
import { Op, Sequelize } from 'sequelize';
import HDate from "../../../helpers/HDate"
import { ADJUNTO_INCLUDE } from "../../../includes/AdjuntoInclude";
import { EDescansoMedico } from "../../enums/EDescansoMedico";

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
                },
                order: [
                    ['fecha_inicio', 'DESC']
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
     * @returns {Promise<DescansoMedicoResponsePaginate>}
     */
    async getAllByColaboradorPaginate(idColaborador: string, page: number, limit: number): Promise<DescansoMedicoResponsePaginate> {
        try {
            const offset = HPagination.getOffset(page, limit);

            const { count, rows } = await DescansoMedico.findAndCountAll({
                attributes: DESCANSOMEDICO_ATTRIBUTES,
                include: [
                    COLABORADOR_INCLUDE,
                    TIPODM_INCLUDE,
                    TIPO_CONTINGENCIA_INCLUDE,
                    DIAGNOSTICO_INCLUDE
                ],
                where: {
                    id_colaborador: idColaborador
                },
                order: [
                    ['fecha_inicio', 'DESC']
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
                    ['fecha_inicio', 'ASC']
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
     * @param {string} idDescansoMedico - El ID del descanso médico a no considerar a buscar
     * @return {Promise<TTotalDias>} La suma de días acumulados
     */
    async getTotalDiasByColaboradorWithoutIdDescanso(
        idColaborador: string,
        idDescansoMedico: string
    ): Promise<TTotalDias> {
        try {
            const descansosMedicos = await DescansoMedico.findAll({
                where: {
                    id_colaborador: idColaborador,
                    estado_registro: EDescansoMedico.REGISTRO_EXITOSO,
                    id: {
                        [Op.ne]: idDescansoMedico
                    }
                },
                order: [
                    ['fecha_inicio', 'ASC']
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
            // console.log('obteniendo el último descanso médico')

            // console.log('idColaborador in isDescansoConsecutivo', idColaborador)
            // console.log('fechaInicioNuevo in inDescansoConsecutivo', fechaInicioNuevo)

            const ultimoDescanso = await DescansoMedico.findOne({
                where: { id_colaborador: idColaborador },
                order: [['fecha_final', 'DESC']],
                limit: 1
            });

            // console.log({ ultimoDescanso })

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
        const { id_colaborador, fecha_inicio, fecha_final } = data
        console.log('fecha_inicio create data one descanso', fecha_inicio)
        console.log('fecha_final create data one descanso', fecha_final)

        const esContinuo = await this.isDescansoConsecutivo(id_colaborador!, fecha_inicio!)

        console.log({ esContinuo })

        const resultValidateFechas = await this.validateAcoplamiento(id_colaborador!, fecha_inicio!, fecha_final!)

        console.log(resultValidateFechas)

        if (!resultValidateFechas) {
            return {
                result: false,
                message: "Error al validar las fechas",
                data: [],
                status: 422
            }
        }

        console.log({ resultValidateFechas })

        const { fechaInicio, fechaFinal } = resultValidateFechas

        data.fecha_otorgamiento = fechaInicio

        data.fecha_inicio = fechaInicio

        data.fecha_final = fechaFinal

        data.total_dias = HDate.differenceDates(fechaInicio, fechaFinal) + 1

        const [
            anioFechaInicio,
            mesFechaInicio,
            diaFechaInicio
        ] = (fechaInicio as string).split("-") as string[]

        const [
            anioFechaFinal,
            mesFechaFinal,
            diaFechaFinal
        ] = (fechaFinal as string).split("-") as string[]

        // Obtener el mes de devengado
        const monthName = HDate.getMonthName(fechaFinal as string)

        const payload: IDescansoMedico = {
            ...data,
            is_continuo: esContinuo,
            dia_fecha_inicio: parseInt(diaFechaInicio, 10),
            mes_fecha_inicio: parseInt(mesFechaInicio, 10),
            anio_fecha_inicio: parseInt(anioFechaInicio, 10),
            dia_fecha_final: parseInt(diaFechaFinal, 10),
            mes_fecha_final: parseInt(mesFechaFinal, 10),
            anio_fecha_final: parseInt(anioFechaFinal, 10),
            mes_devengado: monthName
        }

        // console.log('payload new descanso médico', payload)

        try {
            const newDescanso = await DescansoMedico.create(payload)
            // const newDescanso = await DescansoMedico.create(data)

            // console.log({ newDescanso })

            // const { id: idDescanso } = newDescanso

            // if (!idDescanso) {
            //     return {
            //         result: false,
            //         error: 'Error al registrar el descanso médico',
            //         data: [],
            //         status: 500
            //     }
            // }

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

        // console.log('registros para crear descansos', dataArray)

        try {
            console.log('dataArray createMuliple descansos médicos')
            console.log({ dataArray })

            for (const data of dataArray) {
                const { id_colaborador, fecha_inicio, fecha_final } = data
                console.log({ fecha_inicio })
                console.log({ fecha_final })
                const esContinuo = await this.isDescansoConsecutivo(id_colaborador!, fecha_inicio!)

                // console.log({ esContinuo })

                // Obteniendo fecha de inicio, mes y año de fecha de inicio y fecha final
                const [
                    anioFechaInicio,
                    mesFechaInicio,
                    diaFechaInicio
                ] = fecha_inicio?.split("-") as string[]

                const [
                    anioFechaFinal,
                    mesFechaFinal,
                    diaFechaFinal
                ] = fecha_final?.split("-") as string[]

                // Obtener el mes de devengado
                const monthName = HDate.getMonthName(fecha_final as string)

                const payload: IDescansoMedico = {
                    ...data,
                    is_continuo: esContinuo,
                    dia_fecha_inicio: parseInt(diaFechaInicio, 10),
                    mes_fecha_inicio: parseInt(mesFechaInicio, 10),
                    anio_fecha_inicio: parseInt(anioFechaInicio, 10),
                    dia_fecha_final: parseInt(diaFechaFinal, 10),
                    mes_fecha_final: parseInt(mesFechaFinal, 10),
                    anio_fecha_final: parseInt(anioFechaFinal, 10),
                    mes_devengado: monthName
                }

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
                    COLABORADOR_INCLUDE
                ]
            })

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
     * 
     * @param {string} idColaborador - El ID del colaborador 
     * @param fechaInicio - La fecha de inicio del nuevo descanso médico
     * @param fechaFinal - La fecha de final del nuevo descanso médico
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
            const descansosExistentes = await DescansoMedico.findAll({
                where: {
                    id_colaborador: idColaborador,
                    [Op.and]: [
                        {
                            fecha_inicio: {
                                [Op.lte]: nuevaFechaFinal
                            }
                        },
                        {
                            fecha_final: {
                                [Op.gte]: nuevaFechaInicio
                            }
                        }
                    ]
                },
                order: [
                    ['fecha_inicio', 'ASC']
                ]
            }) as DescansoMedico[]

            // console.log({ descansosExistentes })

            // Si no hay solapamiento, no hay que hacer nada, se puede guardar el registro tal cual
            if (descansosExistentes.length === 0) {
                // console.log('no hay solapamiento')
                return { fechaInicio, fechaFinal };
            }

            // Si hay solapamiento, ajusta las fechas
            let fechaInicioAjustada = nuevaFechaInicio;
            let fechaFinalAjustada = nuevaFechaFinal;

            // Ordena los descansos existentes por fecha de inicio para procesarlos en orden
            // descansosExistentes.sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));

            // Procesa cada solapamiento y ajusta las fechas del nuevo registro
            for (const descanso of descansosExistentes) {
                // Se verifica que las fechas existan antes de convertirlas a tipo Date
                const fechaInicioExistente = descanso.fecha_inicio ? new Date(descanso.fecha_inicio) : null;
                const fechaFinalExistente = descanso.fecha_final ? new Date(descanso.fecha_final) : null;

                // Continúa con la lógica solo si las fechas existen
                if (fechaInicioExistente && fechaFinalExistente) {
                    // Caso 1: Nuevo descanso totalmente cubierto por uno existente
                    if (fechaInicioAjustada >= fechaInicioExistente && fechaFinalAjustada <= fechaFinalExistente) {
                        // console.log('aa')
                        return null;
                    }

                    // Caso 2: El nuevo descanso se solapa al inicio
                    if (fechaInicioAjustada >= fechaInicioExistente && fechaInicioAjustada <= fechaFinalExistente) {
                        // console.log('bb')
                        fechaInicioAjustada = new Date(fechaFinalExistente);
                        fechaInicioAjustada.setDate(fechaInicioAjustada.getDate() + 1);
                    }

                    // Caso 3: El nuevo descanso se solapa al final
                    if (fechaFinalAjustada >= fechaInicioExistente && fechaFinalAjustada <= fechaFinalExistente) {
                        // console.log('cc')
                        fechaFinalAjustada = new Date(fechaInicioExistente);
                        fechaFinalAjustada.setDate(fechaFinalAjustada.getDate() - 1);
                    }
                }
            }

            // Si las fechas ajustadas son válidas (fecha de inicio es anterior a la fecha de finalización), devuélvelas
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
            console.error("Error al validar y ajustar descanso médico:", error);
            return null
        }
    }
}

// export default new DescansoMedicoRepository()

export default DescansoMedicoRepository;