import { Sede } from "../../models/Sede";
import HString from "../../../helpers/HString";
import { ISede, SedeResponse } from '../../interfaces/Sede/ISede';
import { Op } from 'sequelize'
import { SEDE_ATTRIBUTES } from "../../../constants/SedeConstant";

class SedeRepository {
    /**
     * Obtiene todas las sedes
     * @returns {Promise<SedeResponse>} Respuesta con la lista de sedes
     */
    async getAll(): Promise<SedeResponse> {
        try {
            const sedes = await Sede.findAll({
                attributes: SEDE_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: sedes, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas las sedes por estado
     * @param {boolean} estado - El estado de las sedes a buscar
     * @returns {Promise<SedeResponse>}>} Respuesta con la lista de sedes filtrados
     */
    async getAllByEstado(estado: boolean): Promise<SedeResponse> {
        try {
            const sedes = await Sede.findAll({
                where: {
                    estado
                },
                attributes: SEDE_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: sedes, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene una sede  por su ID
     * @param {string} id - El ID UUID de la sede a buscar
     * @returns {Promise<SedeResponse>} Respuesta con la sede encontrada o mensaje de no encontrado
     */
    async getById(id: string): Promise<SedeResponse> {
        try {
            const sede = await Sede.findByPk(id, {
                attributes: SEDE_ATTRIBUTES
            })

            if (!sede) {
                return { result: false, data: [], message: 'Sede no encontrada', status: 404 }
            }

            return { result: true, data: sede, message: 'Sede encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene una sede  por su nombre
     * @param {string} nombre - El nombre de la sede a buscar 
     * @returns {Promise<SedeResponse>} Respuesta con la sede encontrada o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<SedeResponse> {
        try {
            const sede = await Sede.findOne({
                where: {
                    nombre
                },
                attributes: SEDE_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!sede) {
                return { result: false, data: [], message: 'Sede no encontrada', status: 404 }
            }

            return { result: true, data: sede, message: 'Sede encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea una nueva sede
     * @param {ISede} data - Los datos de la sede a crear 
     * @returns {Promise<SedeResponse>} Respuesta con la sede creada
     */
    async create(data: ISede): Promise<SedeResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear una sede ', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingsSede = await Sede.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingsSede) {
                return { result: false, message: 'La sede por registrar ya existe', status: 409 }
            }

            const newSede = await Sede.create(data as ISede)

            if (newSede.id) {
                return { result: true, message: 'Sede registrada con éxito', data: newSede, status: 200 }
            }

            return { result: false, message: 'Error al registrar la sede', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza una sede existente
     * @param {string} id - El ID UUID de la sede a actualizar 
     * @param {ISede} data - Los nuevos datos de la sede 
     * @returns {Promise<SedeResponse>} Respuesta con la sede actualizada
     */
    async update(id: string, data: ISede): Promise<SedeResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const sede = await Sede.findByPk(id)

            if (!sede) {
                return { result: false, message: 'Sede no encontrada', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otra sede
            if (nombre && nombre !== sede.nombre) {
                const existingsSede = await Sede.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingsSede) {
                    return { result: false, message: 'La sede por actualizar ya existe', status: 409 }
                }
            }

            const updatedSede = await sede.update(data)

            return { result: true, message: 'Sede actualizada con éxito', data: updatedSede, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de una sede 
     * @param {string} id - El ID UUID de la sede 
     * @param {boolean} estado - El nuevo estado de la sede 
     * @returns {Promise<SedeResponse>} Respuesta con la sede actualizada
     */
    async updateEstado(id: string, estado: boolean): Promise<SedeResponse> {
        try {
            const sede = await Sede.findByPk(id)

            if (!sede) {
                return { result: false, message: 'Sede no encontrada', status: 404 }
            }

            sede.estado = estado
            await sede.save()

            return { result: true, message: 'Estado actualizado con éxito', data: sede, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) una sede 
     * @param {string} id - El ID UUID de la sede a eliminar
     * @returns {Promise<SedeResponse>} Respuesta con la sede eliminada 
     */
    async delete(id: string): Promise<SedeResponse> {
        try {
            const sede = await Sede.findByPk(id);

            if (!sede) {
                return { result: false, data: [], message: 'Sede no encontrada', status: 404 };
            }

            await sede.destroy();

            return { result: true, data: sede, message: 'Sede eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new SedeRepository()