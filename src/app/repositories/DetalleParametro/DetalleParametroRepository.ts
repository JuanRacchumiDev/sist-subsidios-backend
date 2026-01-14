import { DetalleParametro } from "../../models/DetalleParametro"
import HString from "../../../helpers/HString"
import {
    IDetalleParametro,
    DetalleParametroResponse,
    DetalleParametroResponsePaginate,
    IDetalleParametroPaginate
} from "../../interfaces/DetalleParametro/IDetalleParametro"
import HPagination from "../../../helpers/HPagination"
import { DETALLE_PARAMETRO_ATTRIBUTES } from "../../../constants/DetalleParametroConstant"
import { Op } from 'sequelize'
import { DOCUMENTO_TIPO_CONT_INCLUDE } from "../../../includes/DocumentoTipoContInclude"
// import { TTipoDocumentoSearch } from "@/types/TipoDocumento/TTipoDocumentoSearch"

class DetalleParametroRepository {
    /**
     * Obtiene todos los detalles por clase y estado
     * @param {number} clase - El tipo de clase 
     * @param {boolean} estado - El estado de los detalles 
     * @returns {Promise<DetalleParametroResponse>} Respuesta con la lista de detalles
     */
    async getAll(clase: number, estado: boolean): Promise<DetalleParametroResponse> {
        try {
            const detalles = await DetalleParametro.findAll({
                attributes: DETALLE_PARAMETRO_ATTRIBUTES,
                where: {
                    parametro_clase: clase,
                    estado
                },
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: detalles, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene detalles paginados
     * @param {number} page - Define el número de página 
     * @param {number} limit - Define la cantidad de resultados por página
     * @param {number} clase - Define el tipo de parámetro 
     * @param {boolean} estado - Define el estado de los detalles 
     * @returns {Promise<DetalleParametroResponsePaginate>} - Respuesta con la lista de detalles paginados
     */
    async getAllWithPaginate(
        clase: number,
        page: number,
        limit: number,
        filter: string
    ): Promise<DetalleParametroResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            // const whereClause: any = {}
            const { count, rows } = await DetalleParametro.findAndCountAll({
                attributes: DETALLE_PARAMETRO_ATTRIBUTES,
                where: {
                    parametro_clase: clase,
                    nombre: { [Op.iLike]: `%${filter}%` }
                },
                limit,
                offset,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IDetalleParametroPaginate = {
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
     * Obtiene un detalle por id
     * @param {string} id - Define el identificador de un detalle 
     * @returns {Promise<DetalleParametroResponse>} - Respuesta con el detalle encontrado o mensaje no encontrado
     */
    async getById(id: string): Promise<DetalleParametroResponse> {
        try {
            const detalle = await DetalleParametro.findByPk(id, {
                attributes: DETALLE_PARAMETRO_ATTRIBUTES,
                include: [
                    DOCUMENTO_TIPO_CONT_INCLUDE
                ]
            })

            if (!detalle) {
                return { result: false, data: [], message: 'Detalle no encontrado', status: 404 }
            }

            console.log('---- getById DetalleParametroRepository ----')
            console.log({ detalle })

            return { result: true, data: detalle, message: 'Detalle encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un detalle por nombre
     * @param {string} nombre - Define el nombre de un detalle 
     * @returns {Promise<DetalleParametroResponse>} Respuesta con el detalle encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<DetalleParametroResponse> {
        try {
            const detalle = await DetalleParametro.findOne({
                where: {
                    nombre
                },
                attributes: DETALLE_PARAMETRO_ATTRIBUTES
            })

            if (!detalle) {
                return { result: false, data: [], message: 'Detalle no encontrado', status: 404 }
            }

            return { result: true, data: detalle, message: 'Detalle encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un detalle por nombre_url
     * @param {string} nombreUrl - Define el nombre_url de un detalle 
     * @returns {Promise<DetalleParametroResponse>} Respuesta con el detalle encontrado o mensaje de no encontrado
     */
    async getByNombreUrl(nombreUrl: string): Promise<DetalleParametroResponse> {
        try {
            const detalle = await DetalleParametro.findOne({
                where: {
                    nombre_url: nombreUrl
                },
                attributes: DETALLE_PARAMETRO_ATTRIBUTES
            })

            if (!detalle) {
                return { result: false, data: [], message: 'Detalle no encontrado', status: 404 }
            }

            return { result: true, data: detalle, message: 'Detalle encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un detalle por abreviatura
     * @param {string} abreviatura - Define la abreviatura de un detalle 
     * @returns {Promise<DetalleParametroResponse>} Respuesta con el detalle encontrado o mensaje de no encontrado
     */
    async getByAbreviatura(abreviatura: string): Promise<DetalleParametroResponse> {
        try {
            const detalle = await DetalleParametro.findOne({
                where: {
                    abreviatura
                },
                attributes: DETALLE_PARAMETRO_ATTRIBUTES
            })

            if (!detalle) {
                return { result: false, data: [], message: 'Detalle no encontrado', status: 404 }
            }

            return { result: true, data: detalle, message: 'Detalle encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo detalle
     * @param {IDetalleParametro} data - Los datos del detalle a crear 
     * @returns {Promise<DetalleParametroResponse>} Respuesta con el detalle creado
     */
    async create(data: IDetalleParametro): Promise<DetalleParametroResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un detalle', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingDetalle = await DetalleParametro.findOne({
                where: {
                    nombre
                }
            })

            if (existingDetalle) {
                return { result: false, message: 'El detalle por registrar ya existe', status: 409 }
            }

            const newDetalle = await DetalleParametro.create(data as IDetalleParametro)

            const { id } = newDetalle

            if (id) {
                return { result: true, message: 'Detalle registrado con éxito', data: newDetalle, status: 200 }
            }

            return { result: false, message: 'Error al registrar el detalle', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, message: 'No se pudo crear el detalle', error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un detalle existente
     * @param {string} id - El ID UUID del detalle a actualizar 
     * @param {IDetalleParametro} data - Los nuevos datos del detalle 
     * @returns {Promise<DetalleParametroResponse>} Respuesta con el detalle actualizado
     */
    async update(id: string, data: IDetalleParametro): Promise<DetalleParametroResponse> {
        try {
            const { nombre: newNombre } = data

            if (newNombre) {
                data.nombre_url = HString.convertToUrlString(newNombre as string)
            }

            const detalle = await DetalleParametro.findByPk(id)

            if (!detalle) {
                return { result: false, message: 'Detalle no encontrado', status: 404 }
            }

            const { nombre } = detalle

            // Verificar si el nuevo nombre ya existe en otro detalle
            if (newNombre && newNombre !== nombre) {
                const existingDetalle = await DetalleParametro.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingDetalle) {
                    return { result: false, message: 'El detalle por actualizar ya existe', status: 409 }
                }
            }

            const dataDetalle: Partial<IDetalleParametro> = data

            const updatedDetalle = await detalle.update(dataDetalle)

            return { result: true, message: 'Detalle actualizado con éxito', data: updatedDetalle, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un detalle
     * @param {string} id - El ID UUID del detalle 
     * @param {boolean} estado - El nuevo estado del detalle 
     * @returns {Promise<DetalleParametroResponse>} Respuesta con el detalle actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<DetalleParametroResponse> {
        try {
            const detalle = await DetalleParametro.findByPk(id)

            if (!detalle) {
                return { result: false, message: 'Detalle no encontrado', status: 404 }
            }

            detalle.estado = estado
            await detalle.save()

            return { result: true, message: 'Estado actualizado con éxito', data: detalle, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un detalle
     * @param {string} id - El ID UUID del detalle a eliminar
     * @returns {Promise<DetalleParametroResponse>} Respuesta con el detalle eliminado 
     */
    async delete(id: string): Promise<DetalleParametroResponse> {
        try {
            const detalle = await DetalleParametro.findByPk(id);

            if (!detalle) {
                return { result: false, data: [], message: 'Detalle no encontrado', status: 404 };
            }

            await detalle.destroy();

            return { result: true, data: detalle, message: 'Detalle eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default DetalleParametroRepository