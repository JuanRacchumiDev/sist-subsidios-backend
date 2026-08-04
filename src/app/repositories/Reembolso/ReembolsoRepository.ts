import {
    ReembolsoResponse,
    ReembolsoResponsePaginate,
    IReembolso,
    IReembolsoPaginate
} from "../../interfaces/Reembolso/IReembolso"
import { Reembolso } from "../../models/Reembolso"
import { REEMBOLSO_ATTRIBUTES } from "../../../constants/ReembolsoConstant"
import HPagination from "../../../helpers/HPagination"
import { CANJE_INCLUDE } from "../../../includes/CanjeInclude"
import { IReembolsoFilter } from "../../interfaces/Reembolso/IReembolsoFilter"
import { Op, WhereOptions } from 'sequelize';
import { Persona } from "../../models/Persona"

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

    async getAllPaginate(
        page: number,
        limit: number,
        filters: IReembolsoFilter = {}
    ): Promise<ReembolsoResponsePaginate> {
        try {
            const offset = HPagination.getOffset(page, limit);

            const { search, fecha_pago, numero_expediente } = filters;

            // Filtros para la tabla principal: Reembolso
            const whereReembolso: WhereOptions = {};

            // Filtro por número de expediente
            if (numero_expediente) {
                whereReembolso.numero_expediente = {
                    [Op.iLike]: `%${numero_expediente}%`
                };
            }

            // Filtro por fecha de pago
            if (fecha_pago) {
                whereReembolso.fecha_pago = fecha_pago;
            }

            // Filtros para la relación: Persona (Colaborador)
            let wherePersona: WhereOptions | undefined = undefined;

            if (search) {
                const searchPattern = `%${search.trim()}%`;

                // Búsqueda flexible en el campo directo de Reembolso
                whereReembolso[Op.or as unknown as keyof WhereOptions] = [
                    { nombre_colaborador: { [Op.iLike]: searchPattern } }
                ];

                // Búsqueda en la tabla Persona por si se consulta a través del JOIN
                // wherePersona = {
                //     [Op.or]: [
                //         { nombres: { [Op.iLike]: searchPattern } },
                //         { apellido_paterno: { [Op.iLike]: searchPattern } },
                //         { apellido_materno: { [Op.iLike]: searchPattern } }
                //     ]
                // };
            }

            // Consulta con Sequelize ORM
            const { count, rows } = await Reembolso.findAndCountAll({
                attributes: REEMBOLSO_ATTRIBUTES,
                where: whereReembolso,
                limit,
                offset,
                distinct: true, // Garantiza el conteo exacto al realizar JOINs
                include: [
                    CANJE_INCLUDE,
                    {
                        model: Persona,
                        as: 'persona',
                        required: false, // LEFT JOIN para no excluir si la búsqueda coincide en Reembolso.nombre_colaborador
                        where: wherePersona
                    }
                ],
                order: [
                    ['fecha_registro', 'DESC']
                ]
            });

            // Paginación y respuesta
            const totalPages = Math.ceil(count / limit);
            const nextPage = HPagination.getNextPage(page, limit, count);
            const previousPage = HPagination.getPreviousPage(page);

            const pagination: IReembolsoPaginate = {
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
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
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
        try {
            const newReembolso = await Reembolso.create(data)

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
            const reembolso = await Reembolso.findByPk(id, {
                attributes: REEMBOLSO_ATTRIBUTES,
                include: [CANJE_INCLUDE]
            })

            if (!reembolso) {
                return {
                    result: false,
                    data: [],
                    message: 'Reembolso no encontrado',
                    status: 200
                }
            }

            const dataUpdateReembolso: Partial<IReembolso> = data

            const updateReembolso = await reembolso.update(dataUpdateReembolso)

            return { result: true, message: 'Reembolso actualizado con éxito', data: updateReembolso, status: 200 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }


}

export default ReembolsoRepository