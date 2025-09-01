import { Perfil } from "../../models/Perfil";
import HString from "../../../helpers/HString";
import { IPerfil, PerfilResponse } from '../../interfaces/Perfil/IPerfil';
import { Op } from 'sequelize'

const PERFIL_ATTRIBUTES = [
    'id',
    'nombre',
    'nombre_url',
    'sistema',
    'estado'
];

class PerfilRepository {
    /**
     * Obtiene todos los perfiles
     * @returns {Promise<PerfilResponse>} Respuesta con la lista de perfiles
     */
    async getAll(): Promise<PerfilResponse> {
        try {
            const perfiles = await Perfil.findAll({
                attributes: PERFIL_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: perfiles, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todos los perfiles por estado
     * @param {boolean} estado - El estado de los perfiles a buscar
     * @returns {Promise<PerfilResponse>}>} Respuesta con la lista de perfiles filtrados
     */
    async getAllByEstado(estado: boolean): Promise<PerfilResponse> {
        try {
            const perfiles = await Perfil.findAll({
                where: {
                    estado
                },
                attributes: PERFIL_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })

            return { result: true, data: perfiles, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un perfil por su ID
     * @param {string} id - El ID UUID del perfil a buscar
     * @returns {Promise<PerfilResponse>} Respuesta con el perfil encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id, {
                attributes: PERFIL_ATTRIBUTES
            })

            if (!perfil) {
                return { result: false, data: [], message: 'Perfil no encontrado', status: 404 }
            }

            return { result: true, data: perfil, message: 'perfil encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un perfil por su nombre
     * @param {string} nombre - El nombre del perfil a buscar 
     * @returns {Promise<PerfilResponse>} Respuesta con el perfil encontrado o mensaje de no encontrado
     */
    async getByNombre(nombre: string): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findOne({
                where: {
                    nombre
                },
                attributes: PERFIL_ATTRIBUTES,
                order: [
                    ['id', 'DESC']
                ]
            })

            if (!perfil) {
                return { result: false, data: [], message: 'Perfil no encontrado', status: 404 }
            }

            return { result: true, data: perfil, message: 'perfil encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un nuevo perfil
     * @param {IPerfil} data - Los datos del perfil a crear 
     * @returns {Promise<PerfilResponse>} Respuesta con el perfil creado
     */
    async create(data: IPerfil): Promise<PerfilResponse> {
        try {
            const { nombre } = data

            // Nos aseguramos que el nombre exista
            if (!nombre) {
                return { result: false, message: 'El nombre es requerido para crear un perfil', status: 400 }
            }

            data.nombre_url = HString.convertToUrlString(nombre)

            // Verificar si el nombre existe antes de crear
            const existingsPerfil = await Perfil.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existingsPerfil) {
                return { result: false, message: 'El perfil por registrar ya existe', status: 409 }
            }

            const newPerfil = await Perfil.create(data as IPerfil)

            if (newPerfil.id) {
                return { result: true, message: 'Perfil registrado con éxito', data: newPerfil, status: 200 }
            }

            return { result: false, message: 'Error al registrar el perfil', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un perfil existente
     * @param {string} id - El ID UUID del perfil a actualizar 
     * @param {IPerfil} data - Los nuevos datos del perfil 
     * @returns {Promise<PerfilResponse>} Respuesta con el perfil actualizado
     */
    async update(id: string, data: IPerfil): Promise<PerfilResponse> {
        try {
            const { nombre } = data

            if (nombre) {
                data.nombre_url = HString.convertToUrlString(nombre as String)
            }

            const perfil = await Perfil.findByPk(id)

            if (!perfil) {
                return { result: false, message: 'Perfil no encontrado', status: 404 }
            }

            // Verificar si el nuevo nombre ya existe en otro perfil
            if (nombre && nombre !== perfil.nombre) {
                const existingsPerfil = await Perfil.findOne({
                    where: {
                        nombre,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingsPerfil) {
                    return { result: false, message: 'El perfil por actualizar ya existe', status: 409 }
                }
            }

            const updatedPerfil = await perfil.update(data)

            return { result: true, message: 'Perfil actualizado con éxito', data: updatedPerfil, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de un perfil
     * @param {string} id - El ID UUID del perfil 
     * @param {boolean} estado - El nuevo estado del perfil 
     * @returns {Promise<PerfilResponse>} Respuesta con El perfil actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id)

            if (!perfil) {
                return { result: false, message: 'Perfil no encontrado', status: 404 }
            }

            perfil.estado = estado
            await perfil.save()

            return { result: true, message: 'Estado actualizado con éxito', data: perfil, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (soft delete) un perfil
     * @param {string} id - El ID UUID del perfil a eliminar
     * @returns {Promise<PerfilResponse>} Respuesta con El perfil eliminado 
     */
    async delete(id: string): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id);

            if (!perfil) {
                return { result: false, data: [], message: 'Perfil no encontrado', status: 404 };
            }

            await perfil.destroy();

            return { result: true, data: perfil, message: 'Perfil eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new PerfilRepository()