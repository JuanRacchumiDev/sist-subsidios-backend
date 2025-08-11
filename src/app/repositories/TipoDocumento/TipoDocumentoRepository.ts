import { TipoDocumento } from "../../models/TipoDocumento";
import HString from "../../../utils/helpers/HString";
import { ITipoDocumento, TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';
import { Op } from 'sequelize'

const TIPO_DOCUMENTO_ATTRIBUTES = [
    'id',
    'nombre',
    'nombre_url',
    'abreviatura',
    'longitud',
    'en_persona',
    'en_empresa',
    'compra',
    'venta',
    'sistema',
    'estado'
];

class TipoDocumentoRepository {
    /**
     * Obtiene todos los tipo de documentos
     * @returns {Promise<TipoDocumentoResponse>} Respuesta con la lista de tipo de documentos
     */
    async getAll(): Promise<TipoDocumentoResponse> {
        try {
            const tipos = await TipoDocumento.findAll({
                attributes: TIPO_DOCUMENTO_ATTRIBUTES,
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
     * Obtiene todos los tipo de documentos por estado
     * @param {boolean} estado - El estado de los tipo de documentos a buscar
     * @returns {Promise<TipoDocumentoResponse>}>} Respuesta con la lista de tipo de documentos filtrados
     */
    async getAllByEstado(estado: boolean): Promise<TipoDocumentoResponse> {
        try {
            const tipos = await TipoDocumento.findAll({
                where: {
                    estado
                },
                attributes: TIPO_DOCUMENTO_ATTRIBUTES,
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
     * Obtiene un tipo de documento por su ID
     * @param {string} id - El ID UUID del tipo de documento a buscar
     * @returns {Promise<TipoDocumentoResponse>} Respuesta con el tipo de documento encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id, {
                attributes: TIPO_DOCUMENTO_ATTRIBUTES
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de documento no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de documento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un tipo de documento por su nombre
     * @param {string} nombre - El nombre del tipo de documento a buscar 
     * @returns {Promise<TipoDocumentoResponse>} Respuesta con el tipo de documento encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findOne({
                where: {
                    nombre
                },
                attributes: TIPO_DOCUMENTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de documento no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de documento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un tipo de documento por su abreviatura
     * @param {string} abreviatura - La abreviatura del tipo de documento a buscar 
     * @returns {Promise<TipoDocumentoResponse>} Respuesta con el tipo de documento encontrado o mensaje de no encontrado
     */
    async getByAbreviatura(abreviatura: string): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findOne({
                where: {
                    abreviatura
                },
                attributes: TIPO_DOCUMENTO_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de documento no encontrado', status: 404 }
            }

            return { result: true, data: tipo, message: 'Tipo de documento encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo tipo de documento
     * @param {ITipoDocumento} data - Los datos del tipo de documento a crear 
     * @returns {Promise<TipoDocumentoResponse>} Respuesta con el tipo de documento creado
     */
    async create(data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un tipo de documento', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingTipo = await TipoDocumento.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingTipo) {
                return { result: false, message: 'El tipo de documento por registrar ya existe', status: 409 }
            }

            const newTipo = await TipoDocumento.create(data as any)

            if (newTipo.id) {
                return { result: true, message: 'Tipo de documento registrado con éxito', data: newTipo, status: 200 }
            }

            return { result: false, message: 'Error al registrar el tipo de documento', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un tipo de documento existente
     * @param {string} id - El ID UUID del tipo de documento a actualizar
     * @param {ITipoDocumento} data - Los nuevos datos del tipo de documento 
     * @returns {Promise<TipoDocumentoResponse>} Respuesta con el tipo de documento actualizado
     */
    async update(id: string, data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const tipo = await TipoDocumento.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de documento no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro tipo de documento
            if (nombre && nombre !== tipo.nombre) {
                const existingTipo = await TipoDocumento.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingTipo) {
                    return { result: false, message: 'El tipo de documento por actualizar ya existe', status: 409 }
                }
            }

            const updatedTipo = await tipo.update(data)

            return { result: true, message: 'Tipo de documento actualizado con éxito', data: updatedTipo, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un tipo de documento
     * @param {string} id - El ID UUID del tipo de documento 
     * @param {boolean} estado - El nuevo estado del tipo de documento 
     * @returns {Promise<TipoDocumentoResponse>} Respuesta con el tipo de documento actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id)

            if (!tipo) {
                return { result: false, message: 'Tipo de documento no encontrado', status: 404 }
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
     * Elimina (soft delete) un tipo de documento
     * @param {string} id - El ID UUID del tipo de documento a eliminar
     * @returns {Promise<TipoDocumentoResponse>} Respuesta con el tipo de documento eliminado 
     */
    async delete(id: string): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id);

            if (!tipo) {
                return { result: false, data: [], message: 'Tipo de documento no encontrado', status: 404 };
            }

            await TipoDocumento.destroy();

            return { result: true, data: tipo, message: 'Tipo de documento eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new TipoDocumentoRepository()