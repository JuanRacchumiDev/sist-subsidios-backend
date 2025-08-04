import { Cargo } from "../../models/Cargo";
import HString from "../../../utils/helpers/HString";
import { ICargo, CargoResponse } from '../../interfaces/Cargo/ICargo';
import { Op } from 'sequelize'

class CargoRepository {
    /**
     * Obtiene todos los cargos
     * @returns {Promise<CargoResponse>} Respuesta con la lista de cargos
     */
    async getAll(): Promise<CargoResponse> {
        try {
            const cargos = await Cargo.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: cargos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas las cargos por estado
     * @param {boolean} estado - El estado de los cargos a buscar
     * @returns {Promise<CargoResponse>}>} Respuesta con la lista de cargos filtrados
     */
    async getAllByEstado(estado: boolean): Promise<CargoResponse> {
        try {
            const cargos = await Cargo.findAll({
                where: {
                    estado
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: cargos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un cargo por su ID
     * @param {string} id - El ID UUID del cargo a buscar
     * @returns {Promise<CargoResponse>} Respuesta con el cargo encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ]
            })

            if (!cargo) {
                return { result: false, data: [], message: 'Cargo no encontrado', status: 404 }
            }

            return { result: true, data: cargo, message: 'Cargo encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un cargo por su nombre
     * @param {string} nombre - El nombre del cargo a buscar 
     * @returns {Promise<CargoResponse>} Respuesta con el cargo encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findOne({
                where: {
                    nombre
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!cargo) {
                return { result: false, data: [], message: 'Cargo no encontrado', status: 404 }
            }

            return { result: true, data: cargo, message: 'Cargo encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo cargo
     * @param {ICargo} data - Los datos del cargo a crear 
     * @returns {Promise<CargoResponse>} Respuesta con el cargo creado
     */
    async create(data: ICargo): Promise<CargoResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un cargo', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingsCargo = await Cargo.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingsCargo) {
                return { result: false, message: 'El cargo por registrar ya existe', status: 409 }
            }

            const newCargo = await Cargo.create(data as any)

            if (newCargo.id) {
                return { result: true, message: 'Cargo registrado con éxito', data: newCargo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el cargo', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un cargo existente
     * @param {string} id - El ID UUID del cargo a actualizar 
     * @param {ICargo} data - Los nuevos datos del cargo 
     * @returns {Promise<CargoResponse>} Respuesta con el cargo actualizado
     */
    async update(id: string, data: ICargo): Promise<CargoResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const cargo = await Cargo.findByPk(id)

            if (!cargo) {
                return { result: false, message: 'Cargo no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro cargo
            if (nombre && nombre !== cargo.nombre) {
                const existingsCargo = await Cargo.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingsCargo) {
                    return { result: false, message: 'El cargo por actualizar ya existe', status: 409 }
                }
            }

            const updatedCargo = await cargo.update(data)

            return { result: true, message: 'Cargo actualizado con éxito', data: updatedCargo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un cargo
     * @param {string} id - El ID UUID del cargo 
     * @param {boolean} estado - El nuevo estado del cargo 
     * @returns {Promise<CargoResponse>} Respuesta con el cargo actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findByPk(id)

            if (!cargo) {
                return { result: false, message: 'Cargo no encontrado', status: 404 }
            }

            cargo.estado = estado
            await cargo.save()

            return { result: true, message: 'Estado actualizado con éxito', data: cargo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un cargo
     * @param {string} id - El ID UUID del cargo a eliminar
     * @returns {Promise<CargoResponse>} Respuesta con el cargo eliminado 
     */
    async delete(id: string): Promise<CargoResponse> {
        try {
            const cargo = await Cargo.findByPk(id);

            if (!cargo) {
                return { result: false, data: [], message: 'Cargo no encontrado', status: 404 };
            }

            await Cargo.destroy();

            return { result: true, data: cargo, message: 'Cargo eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new CargoRepository()