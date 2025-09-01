import { Establecimiento } from "../../models/Establecimiento";
import { IEstablecimiento, EstablecimientoResponse } from '../../interfaces/Establecimiento/IEstablecimiento';
import { Op } from 'sequelize'
import { TipoEstablecimiento } from "../../models/TipoEstablecimiento";
import TipoEstablecimientoRepository from "../TipoEstablecimiento/TipoEstablecimientoRepository";
import { ITipoEstablecimiento } from "../../interfaces/TipoEstablecimiento/ITipoEstablecimiento";

const ESTABLECIMIENTO_ATTRIBUTES = [
    'id',
    'id_tipoestablecimiento',
    'ruc',
    "nombre",
    "direccion",
    "telefono",
    "nombre_tipoestablecimiento",
    'sistema',
    'estado'
];

const TIPO_ESTABLECIMIENTO_INCLUDE = {
    model: TipoEstablecimiento,
    as: 'tipoEstablecimiento',
    attributes: ['id', 'nombre']
}

class EstablecimientoRepository {
    /**
     * Obtiene todos los establecimientos
     * @returns {Promise<EstablecimientoResponse>} Respuesta con la lista de establecimientos
     */
    async getAll(): Promise<EstablecimientoResponse> {
        try {
            const establecimientos = await Establecimiento.findAll({
                attributes: ESTABLECIMIENTO_ATTRIBUTES,
                include: [TIPO_ESTABLECIMIENTO_INCLUDE],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: establecimientos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas los establecimientos por estado
     * @param {boolean} estado - El estado de los establecimientos a buscar
     * @returns {Promise<EstablecimientoResponse>}>} Respuesta con la lista de establecimientos filtrados
     */
    async getAllByEstado(estado: boolean): Promise<EstablecimientoResponse> {
        try {
            const establecimientos = await Establecimiento.findAll({
                where: {
                    estado
                },
                attributes: ESTABLECIMIENTO_ATTRIBUTES,
                include: [TIPO_ESTABLECIMIENTO_INCLUDE],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: establecimientos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un establecimiento por su ID
     * @param {string} id - El ID UUID del establecimiento a buscar
     * @returns {Promise<EstablecimientoResponse>} Respuesta con el establecimiento encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<EstablecimientoResponse> {
        try {
            const establecimiento = await Establecimiento.findByPk(id, {
                attributes: ESTABLECIMIENTO_ATTRIBUTES,
                include: [TIPO_ESTABLECIMIENTO_INCLUDE]
            })

            if (!establecimiento) {
                return { result: false, data: [], message: 'Establecimiento no encontrado', status: 404 }
            }

            return { result: true, data: establecimiento, message: 'Establecimiento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un establecimiento por su nombre
     * @param {string} nombre - El nombre del establecimiento a buscar 
     * @returns {Promise<EstablecimientoResponse>} Respuesta con el establecimiento encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<EstablecimientoResponse> {
        try {
            const establecimiento = await Establecimiento.findOne({
                where: {
                    nombre
                },
                attributes: ESTABLECIMIENTO_ATTRIBUTES,
                include: [TIPO_ESTABLECIMIENTO_INCLUDE],
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!establecimiento) {
                return { result: false, data: [], message: 'Establecimiento no encontrado', status: 404 }
            }

            return { result: true, data: establecimiento, message: 'Establecimiento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo establecimiento
     * @param {IEstablecimiento} data - Los datos del establecimiento a crear 
     * @returns {Promise<EstablecimientoResponse>} Respuesta con el establecimiento creado
     */
    async create(data: IEstablecimiento): Promise<EstablecimientoResponse> {
        try {
            const { id_tipoestablecimiento, nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un establecimiento', status: 400 }
            }

            // Verificar si el nombre existe antes de crear
            const existingsEstablecimiento = await Establecimiento.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingsEstablecimiento) {
                return { result: false, message: 'El establecimiento por registrar ya existe', status: 409 }
            }

            if (!id_tipoestablecimiento) {
                return { result: false, message: 'El tipo de establecimiento es requerido para crear un establecimiento', status: 400 }
            }

            const responseTipoEstablecimiento = await TipoEstablecimientoRepository.getById(id_tipoestablecimiento)

            const { result: resultTipoEstablecimiento, data: dataTipoEstablecimiento } = responseTipoEstablecimiento

            if (!resultTipoEstablecimiento || !dataTipoEstablecimiento) {
                return { result: false, message: 'Tipo de establecimiento no encontrado', status: 404 }
            }

            const { nombre: nombreTipoEstablecimiento } = dataTipoEstablecimiento as ITipoEstablecimiento

            data.nombre_tipoestablecimiento = nombreTipoEstablecimiento

            const newEstablecimiento = await Establecimiento.create(data as IEstablecimiento)

            if (newEstablecimiento.id) {
                return { result: true, message: 'Establecimiento registrado con éxito', data: newEstablecimiento, status: 200 }
            }

            return { result: false, message: 'Error al registrar el establecimiento', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un establecimiento existente
     * @param {string} id - El ID UUID del establecimiento a actualizar 
     * @param {IEstablecimiento} data - Los nuevos datos del establecimiento 
     * @returns {Promise<EstablecimientoResponse>} Respuesta con el establecimiento actualizado
     */
    async update(id: string, data: IEstablecimiento): Promise<EstablecimientoResponse> {
        try {
            const { nombre } = data

            const establecimiento = await Establecimiento.findByPk(id)

            if (!establecimiento) {
                return { result: false, message: 'Establecimiento no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro establecimiento
            if (nombre && nombre !== establecimiento.nombre) {
                const existingsEstablecimiento = await Establecimiento.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingsEstablecimiento) {
                    return { result: false, message: 'El establecimiento por actualizar ya existe', status: 409 }
                }
            }

            const updatedEstablecimiento = await establecimiento.update(data)

            return { result: true, message: 'Establecimiento actualizado con éxito', data: updatedEstablecimiento, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un establecimiento
     * @param {string} id - El ID UUID del establecimiento 
     * @param {boolean} estado - El nuevo estado del establecimiento 
     * @returns {Promise<EstablecimientoResponse>} Respuesta con el establecimiento actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<EstablecimientoResponse> {
        try {
            const establecimiento = await Establecimiento.findByPk(id)

            if (!establecimiento) {
                return { result: false, message: 'Establecimiento no encontrado', status: 404 }
            }

            establecimiento.estado = estado
            await establecimiento.save()

            return { result: true, message: 'Estado actualizado con éxito', data: establecimiento, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un establecimiento
     * @param {string} id - El ID UUID del establecimiento a eliminar
     * @returns {Promise<EstablecimientoResponse>} Respuesta con el establecimiento eliminado 
     */
    async delete(id: string): Promise<EstablecimientoResponse> {
        try {
            const establecimiento = await Establecimiento.findByPk(id);

            if (!establecimiento) {
                return { result: false, data: [], message: 'Establecimiento no encontrado', status: 404 };
            }

            await establecimiento.destroy();

            return { result: true, data: establecimiento, message: 'Establecimiento eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new EstablecimientoRepository()