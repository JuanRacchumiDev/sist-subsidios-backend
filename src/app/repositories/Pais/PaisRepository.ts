import { Pais } from "../../models/Pais";
import HString from "../../../utils/helpers/HString";
import { IPais, PaisResponse } from '../../interfaces/Pais/IPais';
import { Op } from 'sequelize'

class PaisRepository {
    /**
     * Obtiene todos los países
     * @returns {Promise<PaisResponse>} Respuesta con la lista de áreas
     */
    async getAll(): Promise<PaisResponse> {
        try {
            const paises = await Pais.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'codigo_postal',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: paises, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas los países por estado
     * @param {boolean} estado - El estado de los países a buscar
     * @returns {Promise<PaisResponse>}>} Respuesta con la lista de países filtrados
     */
    async getAllByEstado(estado: boolean): Promise<PaisResponse> {
        try {
            const paises = await Pais.findAll({
                where: {
                    estado
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'codigo_postal',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: paises, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un país por su ID
     * @param {string} id - El ID UUID del país a buscar
     * @returns {Promise<PaisResponse>} Respuesta con el país encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'codigo_postal',
                    'sistema',
                    'estado'
                ]
            })

            if (!pais) {
                return { result: false, data: [], message: 'País no encontrado', status: 404 }
            }

            return { result: true, data: pais, message: 'País encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un país por su nombre
     * @param {string} nombre - El nombre del país a buscar 
     * @returns {Promise<PaisResponse>} Respuesta con el país encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<PaisResponse> {
        try {
            const pais = await Pais.findOne({
                where: {
                    nombre
                },
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'codigo_postal',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!pais) {
                return { result: false, data: [], message: 'País no encontrado', status: 404 }
            }

            return { result: true, data: pais, message: 'País encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo país
     * @param {IPais} data - Los datos del país a crear 
     * @returns {Promise<PaisResponse>} Respuesta con el país creado
     */
    async create(data: IPais): Promise<PaisResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un país', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingsPais = await Pais.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingsPais) {
                return { result: false, message: 'El país por registrar ya existe', status: 409 }
            }

            const newPais = await Pais.create(data as any)

            if (newPais.id) {
                return { result: true, message: 'País registrado con éxito', data: newPais, status: 200 }
            }

            return { result: false, message: 'Error al registrar el país', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un país existente
     * @param {string} id - El ID UUID del país a actualizar 
     * @param {IPais} data - Los nuevos datos del país 
     * @returns {Promise<PaisResponse>} Respuesta con el país actualizado
     */
    async update(id: string, data: IPais): Promise<PaisResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const pais = await Pais.findByPk(id)

            if (!pais) {
                return { result: false, message: 'País no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro país
            if (nombre && nombre !== pais.nombre) {
                const existingsPais = await Pais.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingsPais) {
                    return { result: false, message: 'El país por actualizar ya existe', status: 409 }
                }
            }

            const updatedPais = await pais.update(data)

            return { result: true, message: 'País actualizado con éxito', data: updatedPais, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un país
     * @param {string} id - El ID UUID del país 
     * @param {boolean} estado - El nuevo estado del país 
     * @returns {Promise<PaisResponse>} Respuesta con el país actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id)

            if (!pais) {
                return { result: false, message: 'País no encontrado', status: 404 }
            }

            pais.estado = estado
            await pais.save()

            return { result: true, message: 'Estado actualizado con éxito', data: pais, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un país
     * @param {string} id - El ID UUID del país a eliminar
     * @returns {Promise<PaisResponse>} Respuesta con el país eliminado 
     */
    async delete(id: string): Promise<PaisResponse> {
        try {
            const pais = await Pais.findByPk(id);

            if (!pais) {
                return { result: false, data: [], message: 'País no encontrado', status: 404 };
            }

            await Pais.destroy();

            return { result: true, data: pais, message: 'País eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new PaisRepository()