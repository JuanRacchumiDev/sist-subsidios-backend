import { Area } from "../../models/Area";
import HString from "../../../utils/helpers/HString";
import { IArea, AreaResponse } from '../../interfaces/Area/IArea';
import { Op } from 'sequelize'

const AREA_ATTRIBUTES = [
    'id',
    'nombre',
    'nombre_url',
    'sistema',
    'estado'
];

class AreaRepository {
    /**
     * Obtiene todas las áreas
     * @returns {Promise<AreaResponse>} Respuesta con la lista de áreas
     */
    async getAll(): Promise<AreaResponse> {
        try {
            const areas = await Area.findAll({
                attributes: AREA_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: areas, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas las áreas por estado
     * @param {boolean} estado - El estado de las áreas a buscar
     * @returns {Promise<AreaResponse>}>} Respuesta con la lista de áreas filtradas
     */
    async getAllByEstado(estado: boolean): Promise<AreaResponse> {
        try {
            const areas = await Area.findAll({
                where: {
                    estado
                },
                attributes: AREA_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: areas, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un área por su ID
     * @param {string} id - El ID UUID del área a buscar
     * @returns {Promise<AreaResponse>} Respuesta con el área encontrada o mensaje de no encontrada
     */
    async getById(id: string): Promise<AreaResponse> {
        try {
            const area = await Area.findByPk(id, {
                attributes: AREA_ATTRIBUTES
            })

            if (!area) {
                return { result: false, data: [], message: 'Área no encontrada', status: 404 }
            }

            return { result: true, data: area, message: 'Área encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un área por su nombre
     * @param {string} nombre - El nombre del área a buscar 
     * @returns {Promise<AreaResponse>} Respuesta con el área encontrada o mensaje de no encontrada
     */
    async getByNombre(nombre: string): Promise<AreaResponse> {
        try {
            const area = await Area.findOne({
                where: {
                    nombre
                },
                attributes: AREA_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!area) {
                return { result: false, data: [], message: 'Área no encontrada', status: 404 }
            }

            return { result: true, data: area, message: 'Área encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea una nueva área
     * @param {IArea} data - Los datos del área a crear 
     * @returns {Promise<AreaResponse>} Respuesta con el área creada
     */
    async create(data: IArea): Promise<AreaResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un área', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingArea = await Area.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingArea) {
                return { result: false, message: 'El área por registrar ya existe', status: 409 }
            }

            const newArea = await Area.create(data as any)

            if (newArea.id) {
                return { result: true, message: 'Área registrada con éxito', data: newArea, status: 200 }
            }

            return { result: false, message: 'Error al registrar el área', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un área existente
     * @param {string} id - El ID UUID del área a actualizar 
     * @param {IArea} data - Los nuevos datos del área 
     * @returns {Promise<AreaResponse>} Respuesta con el área actualizada
     */
    async update(id: string, data: IArea): Promise<AreaResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const area = await Area.findByPk(id)

            if (!area) {
                return { result: false, message: 'Área no encontrada', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otra área
            if (nombre && nombre !== area.nombre) {
                const existingArea = await Area.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingArea) {
                    return { result: false, message: 'El área por actualizar ya existe', status: 409 }
                }
            }

            const updatedArea = await area.update(data)

            return { result: true, message: 'Área actualizada con éxito', data: updatedArea, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un área
     * @param {string} id - El ID UUID del área 
     * @param {boolean} estado - El nuevo estado del área 
     * @returns {Promise<AreaResponse>} Respuesta con el área actualizada
     */
    async updateEstado(id: string, estado: boolean): Promise<AreaResponse> {
        try {
            const area = await Area.findByPk(id)

            if (!area) {
                return { result: false, message: 'Área no encontrada', status: 404 }
            }

            area.estado = estado
            await area.save()

            return { result: true, message: 'Estado actualizado con éxito', data: area, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un área
     * @param {string} id - El ID UUID del área a eliminar
     * @returns {Promise<AreaResponse>} Respuesta con el área eliminada 
     */
    async delete(id: string): Promise<AreaResponse> {
        try {
            const area = await Area.findByPk(id);

            if (!area) {
                return { result: false, data: [], message: 'Área no encontrada', status: 404 };
            }

            await area.destroy();

            return { result: true, data: area, message: 'Área eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new AreaRepository()