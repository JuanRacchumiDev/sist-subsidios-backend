import {
    ReembolsoResponse,
    ReembolsoResponsePaginate,
    IReembolso,
    IReembolsoPaginate
} from "../../interfaces/Reembolso/IReembolso"
import { Reembolso } from "../../models/Reembolso"
import { Canje } from "../../models/Canje"
import sequelize from "../../../config/database"
import { REEMBOLSO_ATTRIBUTES } from "../../../constants/ReembolsoConstant"
import HPagination from "../../../helpers/HPagination"
import { Op, Transaction } from "sequelize"
import { CANJE_INCLUDE } from "../../../includes/CanjeInclude"
import HDate from "../../../helpers/HDate"

class ReembolsoRepository {
    /**
     * Obtiene todos los reembolsos
     * @returns {Promise<ReembolsoResponse>}
     */
    async getAll(): Promise<ReembolsoResponse> {
        try {
            const reembolsos = await Reembolso.findAll({
                attributes: REEMBOLSO_ATTRIBUTES,
                include: [CANJE_INCLUDE],
                order: [
                    ['fecha_registro', 'DESC']
                ]
            })

            return { result: true, data: reembolsos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number): Promise<ReembolsoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const { count, rows } = await Reembolso.findAndCountAll({
                attributes: REEMBOLSO_ATTRIBUTES,
                include: [CANJE_INCLUDE],
                order: [
                    ['fecha_registro', 'DESC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IReembolsoPaginate = {
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
     * Obtiene un reembolso por su ID
     * @param {string} id - El ID UUID del reembolso a buscar
     * @returns {Promise<ReembolsoResponse>} Respuesta con el reembolso encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<ReembolsoResponse> {
        try {
            const reembolso = await Reembolso.findByPk(id, {
                attributes: REEMBOLSO_ATTRIBUTES,
                include: [CANJE_INCLUDE]
            })

            if (!reembolso) {
                return {
                    result: false,
                    data: [],
                    message: 'Reembolso no encontrado',
                    status: 404
                }
            }

            return {
                result: true,
                data: reembolso,
                message: 'Reembolso encontrado',
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un reembolso
     * @param {IReembolso} data - Los datos del reembolso a crear
     * @returns {Promise<ReembolsoResponse>} Respuesta con el reembolso creado o error
     */
    async create(data: IReembolso): Promise<ReembolsoResponse> {
        // const {
        //     fecha_inicio_subsidio,
        //     fecha_final_subsidio,
        //     fecha_inicio_dm,
        //     fecha_final_dm
        // } = data

        // const [
        //     anioFechaInicioSubsidio,
        //     mesFechaInicioSubsidio,
        //     diaFechaInicioSubsidio
        // ] = (fecha_inicio_subsidio as string).split("-") as string[]

        // const [
        //     anioFechaFinalSubsidio,
        //     mesFechaFinalSubsidio,
        //     diaFechaFinalSubsidio
        // ] = (fecha_final_subsidio as string).split("-") as string[]

        // const [
        //     anioFechaInicioDM,
        //     mesFechaInicioDM,
        //     diaFechaInicioDM
        // ] = (fecha_inicio_dm as string).split("-") as string[]

        // const [
        //     anioFechaFinalDM,
        //     mesFechaFinalDM,
        //     diaFechaFinalDM
        // ] = (fecha_final_dm as string).split("-") as string[]

        // Obtener el mes de devengado
        // const monthName = HDate.getMonthName(fecha_final_subsidio as string)

        // const payload: Ireembolso = {
        //     ...data,
        //     dia_fecha_inicio_subsidio: parseInt(diaFechaInicioSubsidio, 10),
        //     mes_fecha_inicio_subsidio: parseInt(mesFechaInicioSubsidio, 10),
        //     anio_fecha_inicio_subsidio: parseInt(anioFechaInicioSubsidio, 10),
        //     dia_fecha_final_subsidio: parseInt(diaFechaFinalSubsidio, 10),
        //     mes_fecha_final_subsidio: parseInt(mesFechaFinalSubsidio, 10),
        //     anio_fecha_final_subsidio: parseInt(anioFechaFinalSubsidio, 10),
        //     mes_devengado: monthName
        // }

        const payload: IReembolso = {
            ...data
        }

        try {
            // const newReembolso = await Reembolso.create(data, { transaction })
            const newReembolso = await Reembolso.create(payload)

            // const { id: idCanje } = newCanje

            if (!newReembolso || !newReembolso.id) {
                return {
                    result: false,
                    error: 'Error al registrar el reembolso',
                    data: [],
                    status: 500
                }
            }

            return {
                result: true,
                message: 'Reembolso registrado con éxito',
                data: newReembolso,
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un reembolso existente por su ID
     * @param {string} id - El ID del reembolso a actualizar
     * @param {IReembolso} data - Los nuevos datos del reembolso
     * @returns {Promise<ReembolsoResponse>} Respuesta con el reembolso actualizado o error
     */
    async update(id: string, data: IReembolso): Promise<ReembolsoResponse> {
        // const transaction = await sequelize.transaction()

        try {
            // const reembolso = await Reembolso.findByPk(id, { transaction })
            const reembolso = await Reembolso.findByPk(id)

            if (!reembolso) {
                // await transaction.rollback();
                return {
                    result: false,
                    data: [],
                    message: 'Reembolso no encontrado',
                    status: 200
                }
            }

            const dataUpdateReembolso: Partial<IReembolso> = data

            // const updatedReembolso = await reembolso.update(dataUpdateReembolso, { transaction })
            const updatedReembolso = await reembolso.update(dataUpdateReembolso)

            // await transaction.commit()

            return { result: true, message: 'Reembolso actualizado con éxito', data: updatedReembolso, status: 200 }
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
    //         const ultimoreembolso = await Reembolso.findOne({
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
    //         throw new Error('No se pudo generar el correlativo del reembolso');
    //     }
    // }
}

// export default new ReembolsoRepository()

export default ReembolsoRepository