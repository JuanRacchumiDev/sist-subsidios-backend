import { TipoEstablecimiento } from "../../models/TipoEstablecimiento";
import HString from "../../../utils/helpers/HString";
import { ITipoEstablecimiento, TipoEstablecimientoResponse } from '../../interfaces/TipoEstablecimiento/ITipoEstablecimiento';
import { Op } from 'sequelize'

const TIPO_ESTABLECIMIENTO_ATTRIBUTES = [
    'id',
    'nombre',
    'nombre_url',
    'sistema',
    'estado'
];

class TipoEstablecimientoRepository {
    /**
     * Obtiene todos los tipo de establecimientos
     * @returns {Promise<TipoEstablecimientoResponse>} Respuesta con la lista de tipo de establecimientos
     */
    async getAll(): Promise<TipoEstablecimientoResponse> {
        try {
            const tipos = await TipoEstablecimiento.findAll({
                attributes: TIPO_ESTABLECIMIENTO_ATTRIBUTES,
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
     * Obtiene todos los tipo de establecimientos por estado
     * @param {boolean} estado - El estado de los tipo de establecimientos a buscar
     * @returns {Promise<TipoEstablecimientoResponse>}>} Respuesta con la lista de tipo de establecimientos filtrados
     */
    async getAllByEstado(estado: boolean): Promise<TipoEstablecimientoResponse> {
        try {
            const tipos = await TipoEstablecimiento.findAll({
                where: {
                    estado
                },
                attributes: TIPO_ESTABLECIMIENTO_ATTRIBUTES,
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
     * Obtiene un tipo de establecimiento por su ID
     * @param {string} id - El ID UUID del tipo de establecimiento a buscar
     * @returns {Promise<TipoEstablecimientoResponse>} Respuesta con el tipo de establecimiento encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<TipoEstablecimientoResponse> {
        try {
            const tipo = await TipoEstablecimiento.findByPk(id, {
                attributes: TIPO_ESTABLECIMIENTO_ATTRIBUTES
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de establecimiento no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de establecimiento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un tipo de establecimiento por su nombre
     * @param {string} nombre - El nombre del tipo de establecimiento a buscar 
     * @returns {Promise<TipoEstablecimientoResponse>} Respuesta con el tipo de establecimiento encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<TipoEstablecimientoResponse> {
        try {
            const tipo = await TipoEstablecimiento.findOne({
                where: {
                    nombre
                },
                attributes: TIPO_ESTABLECIMIENTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de establecimiento no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de establecimiento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo tipo de establecimiento
     * @param {ITipoEstablecimiento} data - Los datos del tipo de establecimiento a crear 
     * @returns {Promise<TipoEstablecimientoResponse>} Respuesta con el tipo de establecimiento creado
     */
    async create(data: ITipoEstablecimiento): Promise<TipoEstablecimientoResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un tipo de establecimiento', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingTipo = await TipoEstablecimiento.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingTipo) {
                return { result: false, message: 'El tipo de establecimiento por registrar ya existe', status: 409 }
            }

            const newTipo = await TipoEstablecimiento.create(data as any)

            if (newTipo.id) {
                return { result: true, message: 'Tipo de establecimiento registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de establecimiento', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un tipo de establecimiento existente
     * @param {string} id - El ID UUID del tipo de establecimiento a actualizar
     * @param {ITipoEstablecimiento} data - Los nuevos datos del tipo de establecimiento 
     * @returns {Promise<TipoEstablecimientoResponse>} Respuesta con el tipo de establecimiento actualizado
     */
    async update(id: string, data: ITipoEstablecimiento): Promise<TipoEstablecimientoResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const tipo = await TipoEstablecimiento.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de establecimiento no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro tipo de establecimiento
            if (nombre && nombre !== tipo.nombre) {
                const existingTipo = await TipoEstablecimiento.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingTipo) {
                    return { result: false, message: 'El tipo de establecimeinto por actualizar ya existe', status: 409 }
                }
            }

            const updatedTipo = await tipo.update(data)

            return { result: true, message: 'Tipo de establecimiento actualizado con éxito', data: updatedTipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un tipo de establecimiento
     * @param {string} id - El ID UUID del tipo de establecimiento 
     * @param {boolean} estado - El nuevo estado del tipo de establecimiento 
     * @returns {Promise<TipoEstablecimientoResponse>} Respuesta con el tipo de establecimiento actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<TipoEstablecimientoResponse> {
        try {
            const tipo = await TipoEstablecimiento.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de establecimiento no encontrado', status: 404 }
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
     * Elimina (soft delete) un tipo de establecimiento
     * @param {string} id - El ID UUID del tipo de establecimiento a eliminar
     * @returns {Promise<TipoEstablecimientoResponse>} Respuesta con el tipo de establecimiento eliminado 
     */
    async delete(id: string): Promise<TipoEstablecimientoResponse> {
        try {
            const tipo = await TipoEstablecimiento.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de establecimiento no encontrado', status: 404 };
            }

            await TipoEstablecimiento.destroy();

            return { result: true, data: tipo, message: 'Tipo de establecimiento eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoEstablecimientoRepository()