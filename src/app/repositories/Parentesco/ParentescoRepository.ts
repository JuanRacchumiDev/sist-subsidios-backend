import { Parentesco } from "../../models/Parentesco";
import HString from "../../../helpers/HString";
import { IParentesco, ParentescoResponse } from '../../interfaces/Parentesco/IParentesco';
import { Op } from 'sequelize'
import { PARENTESCO_ATTRIBUTES } from "../../../constants/ParentescoConstant";

class ParentescoRepository {
    /**
     * Obtiene todos los parentescos
     * @returns {Promise<ParentescoResponse>} Respuesta con la lista de parentescos
     */
    async getAll(): Promise<ParentescoResponse> {
        try {
            const parentescos = await Parentesco.findAll({
                attributes: PARENTESCO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: parentescos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todos los parentescos por estado
     * @param {boolean} estado - El estado de los parentescos a buscar
     * @returns {Promise<ParentescoResponse>}>} Respuesta con la lista de parentescos filtrados
     */
    async getAllByEstado(estado: boolean): Promise<ParentescoResponse> {
        try {
            const parentescos = await Parentesco.findAll({
                where: {
                    estado
                },
                attributes: PARENTESCO_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: parentescos, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un parentesco por su ID
     * @param {string} id - El ID UUID del parentesco a buscar
     * @returns {Promise<ParentescoResponse>} Respuesta con el parentesco encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<ParentescoResponse> {
        try {
            const parentesco = await Parentesco.findByPk(id, {
                attributes: PARENTESCO_ATTRIBUTES
            })

            if (!parentesco) {
                return { result: false, data: [], message: 'Parentesco no encontrado', status: 404 }
            }

            return { result: true, data: parentesco, message: 'Parentesco encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un parentesco por su nombre
     * @param {string} nombre - El nombre del parentesco a buscar 
     * @returns {Promise<ParentescoResponse>} Respuesta con el parentesco encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<ParentescoResponse> {
        try {
            const parentesco = await Parentesco.findOne({
                where: {
                    nombre
                },
                attributes: PARENTESCO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!parentesco) {
                return { result: false, data: [], message: 'Parentesco no encontrado', status: 404 }
            }

            return { result: true, data: parentesco, message: 'Parentesco encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo parentesco
     * @param {IParentesco} data - Los datos del parentesco a crear 
     * @returns {Promise<ParentescoResponse>} Respuesta con el parentesco creado
     */
    async create(data: IParentesco): Promise<ParentescoResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un parentesco', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingsParentesco = await Parentesco.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingsParentesco) {
                return { result: false, message: 'El parentesco por registrar ya existe', status: 409 }
            }

            const newParentesco = await Parentesco.create(data as IParentesco)

            if (newParentesco.id) {
                return { result: true, message: 'Parentesco registrado con éxito', data: newParentesco, status: 200 }
            }

            return { result: false, message: 'Error al registrar el parentesco', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un parentesco existente
     * @param {string} id - El ID UUID del parentesco a actualizar 
     * @param {IParentesco} data - Los nuevos datos del parentesco 
     * @returns {Promise<ParentescoResponse>} Respuesta con el parentesco actualizado
     */
    async update(id: string, data: IParentesco): Promise<ParentescoResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const parentesco = await Parentesco.findByPk(id)

            if (!parentesco) {
                return { result: false, message: 'Parentesco no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro parentesco
            if (nombre && nombre !== parentesco.nombre) {
                const existingsParentesco = await Parentesco.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingsParentesco) {
                    return { result: false, message: 'El parentesco por actualizar ya existe', status: 409 }
                }
            }

            const updatedParentesco = await parentesco.update(data)

            return { result: true, message: 'Parentesco actualizado con éxito', data: updatedParentesco, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un parentesco
     * @param {string} id - El ID UUID del parentesco 
     * @param {boolean} estado - El nuevo estado del parentesco 
     * @returns {Promise<ParentescoResponse>} Respuesta con el parentesco actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<ParentescoResponse> {
        try {
            const parentesco = await Parentesco.findByPk(id)

            if (!parentesco) {
                return { result: false, message: 'Parentesco no encontrado', status: 404 }
            }

            parentesco.estado = estado
            await parentesco.save()

            return { result: true, message: 'Estado actualizado con éxito', data: parentesco, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un parentesco
     * @param {string} id - El ID UUID del parentesco a eliminar
     * @returns {Promise<ParentescoResponse>} Respuesta con el parentesco eliminado 
     */
    async delete(id: string): Promise<ParentescoResponse> {
        try {
            const parentesco = await Parentesco.findByPk(id);

            if (!parentesco) {
                return { result: false, data: [], message: 'Parentesco no encontrado', status: 404 };
            }

            await parentesco.destroy();

            return { result: true, data: parentesco, message: 'Parentesco eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

// export default new ParentescoRepository()

export default ParentescoRepository