import { TipoAdjunto } from "../../models/TipoAdjunto";
import HString from "../../../helpers/HString";
import { ITipoAdjunto, TipoAdjuntoResponse } from '../../interfaces/TipoAdjunto/ITipoAdjunto';
import { Op } from 'sequelize'
import { TIPOADJUNTO_ATTRIBUTES } from "../../../constants/TipoAdjuntoConstant";

class TipoAdjuntoRepository {
    /**
     * Obtiene todos los tipos de adjuntos
     * @returns {Promise<TipoAdjuntoResponse>} Respuesta con la lista de tipo de adjuntos
     */
    async getAll(): Promise<TipoAdjuntoResponse> {
        try {
            const tipos = await TipoAdjunto.findAll({
                attributes: TIPOADJUNTO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas las tipo de adjuntos por estado
     * @param {boolean} estado - El estado de los tipo de adjuntos a buscar
     * @returns {Promise<TipoAdjuntoResponse>}>} Respuesta con la lista de tipo de adjuntos filtrados
     */
    async getAllByEstado(estado: boolean): Promise<TipoAdjuntoResponse> {
        try {
            const tipos = await TipoAdjunto.findAll({
                where: {
                    estado
                },
                attributes: TIPOADJUNTO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: tipos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un tipo de adjunto por su ID
     * @param {string} id - El ID UUID del tipo de adjunto a buscar
     * @returns {Promise<TipoAdjuntoResponse>} Respuesta con el tipo de adjunto encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<TipoAdjuntoResponse> {
        try {
            const tipo = await TipoAdjunto.findByPk(id, {
                attributes: TIPOADJUNTO_ATTRIBUTES
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de adjunto no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un tipo de adjunto por su nombre
     * @param {string} nombre - El nombre del tipo de adjunto a buscar 
     * @returns {Promise<TipoAdjuntoResponse>} Respuesta con el tipo de adjunto encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<TipoAdjuntoResponse> {
        try {
            const tipo = await TipoAdjunto.findOne({
                where: {
                    nombre
                },
                attributes: TIPOADJUNTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de adjunto no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo tipo de adjunto
     * @param {ITipoAdjunto} data - Los datos del tipo de adjunto a crear 
     * @returns {Promise<TipoAdjuntoResponse>} Respuesta con el tipo de adjunto creado
     */
    async create(data: ITipoAdjunto): Promise<TipoAdjuntoResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un tipo de adjunto', status: 400 }
            }

            // Verificar si el nombre existe antes de crear
            const existingsTipo = await TipoAdjunto.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingsTipo) {
                return { result: false, message: 'El tipo de adjunto por registrar ya existe', status: 409 }
            }

            const newTipo = await TipoAdjunto.create(data as ITipoAdjunto)

            if (newTipo.id) {
                return { result: true, message: 'Tipo de adjunto registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de adjunto', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un tipo de adjunto existente
     * @param {string} id - El ID UUID del tipo de adjunto a actualizar 
     * @param {ITipoAdjunto} data - Los nuevos datos del tipo de adjunto 
     * @returns {Promise<TipoAdjuntoResponse>} Respuesta con el tipo de adjunto actualizado
     */
    async update(id: string, data: ITipoAdjunto): Promise<TipoAdjuntoResponse> {
        try {
            const { nombre } = data

            const tipo = await TipoAdjunto.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de adjunto no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro tipo de adjunto
            if (nombre && nombre !== tipo.nombre) {
                const existingsTipo = await TipoAdjunto.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingsTipo) {
                    return { result: false, message: 'El tipo de adjunto por actualizar ya existe', status: 409 }
                }
            }

            const updatedTipo = await tipo.update(data)

            return { result: true, message: 'Tipo de adjunto actualizado con éxito', data: updatedTipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un tipo de adjunto
     * @param {string} id - El ID UUID del tipo de adjunto 
     * @param {boolean} estado - El nuevo estado del tipo de adjunto 
     * @returns {Promise<TipoAdjuntoResponse>} Respuesta con el tipo de adjunto actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<TipoAdjuntoResponse> {
        try {
            const tipo = await TipoAdjunto.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de adjunto no encontrado', status: 404 }
            }

            tipo.estado = estado
            await tipo.save()

            return { result: true, message: 'Estado actualizado con éxito', data: tipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un tipo de adjunto
     * @param {string} id - El ID UUID del tipo de adjunto a eliminar
     * @returns {Promise<TipoAdjuntoResponse>} Respuesta con el tipo de adjunto eliminado 
     */
    async delete(id: string): Promise<TipoAdjuntoResponse> {
        try {
            const tipo = await TipoAdjunto.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de adjunto no encontrado', status: 404 };
            }

            await tipo.destroy();

            return { result: true, data: tipo, message: 'Tipo de adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoAdjuntoRepository()