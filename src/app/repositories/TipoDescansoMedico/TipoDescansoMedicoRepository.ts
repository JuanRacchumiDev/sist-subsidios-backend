import { TipoDescansoMedico } from "../../models/TipoDescansoMedico";
import HString from "../../../utils/helpers/HString";
import { ITipoDescansoMedico, TipoDescansoMedicoResponse } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';
import { Op } from 'sequelize'

class TipoDescansoMedicoRepository {
    /**
     * Obtiene todos los tipo de descansos médicos
     * @returns {Promise<TipoDescansoMedicoResponse>} Respuesta con la lista de tipo de descansos médicos
     */
    async getAll(): Promise<TipoDescansoMedicoResponse> {
        try {
            const tipos = await TipoDescansoMedico.findAll({
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

            return { result: true, data: tipos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todos los tipo de descansos médicos por estado
     * @param {boolean} estado - El estado de los tipo de descansos médicos a buscar
     * @returns {Promise<TipoDescansoMedicoResponse>}>} Respuesta con la lista de tipo de descansos médicos filtrados
     */
    async getAllByEstado(estado: boolean): Promise<TipoDescansoMedicoResponse> {
        try {
            const tipos = await TipoDescansoMedico.findAll({
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

            return { result: true, data: tipos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un tipo de descanso médico por su ID
     * @param {string} id - El ID UUID del tipo de descanso médico a buscar
     * @returns {Promise<TipoDescansoMedicoResponse>} Respuesta con el tipo de descanso médico encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<TipoDescansoMedicoResponse> {
        try {
            const tipo = await TipoDescansoMedico.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de descanso médico no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de descanso médico encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un tipo de descanso médico por su nombre
     * @param {string} nombre - El nombre del tipo de descanso médico a buscar 
     * @returns {Promise<TipoDescansoMedicoResponse>} Respuesta con el tipo de descanso médico encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<TipoDescansoMedicoResponse> {
        try {
            const tipo = await TipoDescansoMedico.findOne({
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

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de descanso médico no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de descanso médico encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo tipo de descanso médico
     * @param {ITipoDescansoMedico} data - Los datos del tipo de descanso médico a crear 
     * @returns {Promise<TipoDescansoMedicoResponse>} Respuesta con el tipo de descanso médico creado
     */
    async create(data: ITipoDescansoMedico): Promise<TipoDescansoMedicoResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un tipo de descanso médico', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingTipo = await TipoDescansoMedico.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingTipo) {
                return { result: false, message: 'El tipo de descanso médico por registrar ya existe', status: 409 }
            }

            const newTipo = await TipoDescansoMedico.create(data as any)

            if (newTipo.id) {
                return { result: true, message: 'Tipo de descanso médico registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de descanso médico', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un tipo de descanso médico existente
     * @param {string} id - El ID UUID del tipo de descanso médico a actualizar
     * @param {ITipoDescansoMedico} data - Los nuevos datos del tipo de descanso médico 
     * @returns {Promise<TipoDescansoMedicoResponse>} Respuesta con el tipo de descanso médico actualizado
     */
    async update(id: string, data: ITipoDescansoMedico): Promise<TipoDescansoMedicoResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const tipo = await TipoDescansoMedico.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de descanso médico no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro tipo de descanso médico
            if (nombre && nombre !== tipo.nombre) {
                const existingTipo = await TipoDescansoMedico.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingTipo) {
                    return { result: false, message: 'El tipo de descanso médico por actualizar ya existe', status: 409 }
                }
            }

            const updatedTipo = await tipo.update(data)

            return { result: true, message: 'Tipo de descanso médico actualizado con éxito', data: updatedTipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un tipo de descanso médico
     * @param {string} id - El ID UUID del tipo de descanso médico 
     * @param {boolean} estado - El nuevo estado del tipo de descanso médico 
     * @returns {Promise<TipoDescansoMedicoResponse>} Respuesta con el tipo de descanso médico actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<TipoDescansoMedicoResponse> {
        try {
            const tipo = await TipoDescansoMedico.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de descanso médico no encontrado', status: 404 }
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
     * Elimina (soft delete) un tipo de descanso médico
     * @param {string} id - El ID UUID del tipo de descanso médico a eliminar
     * @returns {Promise<TipoDescansoMedicoResponse>} Respuesta con el tipo de descanso médico eliminado 
     */
    async delete(id: string): Promise<TipoDescansoMedicoResponse> {
        try {
            const tipo = await TipoDescansoMedico.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de descanso médico no encontrado', status: 404 };
            }

            await TipoDescansoMedico.destroy();

            return { result: true, data: tipo, message: 'Tipo de descanso médico eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoDescansoMedicoRepository()