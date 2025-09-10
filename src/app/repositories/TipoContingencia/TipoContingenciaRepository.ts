import { TipoContingencia } from "../../models/TipoContingencia";
import HString from "../../../helpers/HString";
import { ITipoContingencia, TipoContingenciaResponse } from '../../interfaces/TipoContingencia/ITipoContingencia';
import { Op } from 'sequelize'
import { DocumentoTipoCont } from "../../models/DocumentoTipoCont";
import { TIPO_CONTINGENCIA_ATTRIBUTES } from "../../../constants/TipoContingenciaConstant";
import { TIPO_DOCUMENTO_INCLUDE } from "../../../includes/TipoDocumentoInclude";

class TipoContingenciaRepository {
    /**
     * Obtiene todos los tipo de contingencias
     * @returns {Promise<TipoContingenciaResponse>} Respuesta con la lista de tipo de contingencias
     */
    async getAll(): Promise<TipoContingenciaResponse> {
        try {
            const tipos = await TipoContingencia.findAll({
                attributes: TIPO_CONTINGENCIA_ATTRIBUTES,
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
     * Obtiene todos los tipo de contingencias por estado
     * @param {boolean} estado - El estado de los tipo de contingencias a buscar
     * @returns {Promise<TipoContingenciaResponse>}>} Respuesta con la lista de tipo de contingencias filtrados
     */
    async getAllByEstado(estado: boolean): Promise<TipoContingenciaResponse> {
        try {
            const tipos = await TipoContingencia.findAll({
                where: {
                    estado
                },
                attributes: TIPO_CONTINGENCIA_ATTRIBUTES,
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
     * Obtiene un tipo de contingencia por su ID
     * @param {string} id - El ID UUID del tipo de contingencia a buscar
     * @returns {Promise<TipoContingenciaResponse>} Respuesta con el tipo de contingencia encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<TipoContingenciaResponse> {
        try {
            const tipo = await TipoContingencia.findByPk(id, {
                attributes: TIPO_CONTINGENCIA_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de contingencia no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de contingencia encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un tipo de contingencia por su nombre
     * @param {string} nombre - El nombre del tipo de contingencia a buscar 
     * @returns {Promise<TipoContingenciaResponse>} Respuesta con el tipo de contingencia encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<TipoContingenciaResponse> {
        try {
            const tipo = await TipoContingencia.findOne({
                where: {
                    nombre
                },
                attributes: TIPO_CONTINGENCIA_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de contingencia no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de contingencia encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo tipo de contingencia
     * @param {ITipoContingencia} data - Los datos del tipo de contingencia a crear 
     * @returns {Promise<TipoContingenciaResponse>} Respuesta con el tipo de contingencia creado
     */
    async create(data: ITipoContingencia): Promise<TipoContingenciaResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un tipo de contingencia', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingTipo = await TipoContingencia.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingTipo) {
                return { result: false, message: 'El tipo de contingencia por registrar ya existe', status: 409 }
            }

            const newTipo = await TipoContingencia.create(data as ITipoContingencia)

            if (newTipo.id) {
                return { result: true, message: 'Tipo de contingencia registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de contingencia', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un tipo de contingencia existente
     * @param {string} id - El ID UUID del tipo de contingencia a actualizar
     * @param {ITipoContingencia} data - Los nuevos datos del tipo de contingencia 
     * @returns {Promise<TipoContingenciaResponse>} Respuesta con el tipo de contingencia actualizado
     */
    async update(id: string, data: ITipoContingencia): Promise<TipoContingenciaResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const tipo = await TipoContingencia.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de contingencia no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro tipo de contingencia
            if (nombre && nombre !== tipo.nombre) {
                const existingTipo = await TipoContingencia.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingTipo) {
                    return { result: false, message: 'El tipo de contingencia por actualizar ya existe', status: 409 }
                }
            }

            const updatedTipo = await tipo.update(data)

            return { result: true, message: 'Tipo de contingencia actualizado con éxito', data: updatedTipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un tipo de contingencia
     * @param {string} id - El ID UUID del tipo de contingencia 
     * @param {boolean} estado - El nuevo estado del tipo de contingencia 
     * @returns {Promise<TipoContingenciaResponse>} Respuesta con el tipo de contingencia actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<TipoContingenciaResponse> {
        try {
            const tipo = await TipoContingencia.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de contingencia no encontrado', status: 404 }
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
     * Elimina (soft delete) un tipo de contingencia
     * @param {string} id - El ID UUID del tipo de contingencia a eliminar
     * @returns {Promise<TipoContingenciaResponse>} Respuesta con el tipo de contingencia eliminado 
     */
    async delete(id: string): Promise<TipoContingenciaResponse> {
        try {
            const tipo = await TipoContingencia.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de contingencia no encontrado', status: 404 };
            }

            await tipo.destroy();

            return { result: true, data: tipo, message: 'Tipo de contingencia eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoContingenciaRepository()