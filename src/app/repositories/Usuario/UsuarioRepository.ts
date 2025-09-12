import sequelize from '../../../config/database'
import { Usuario } from "../../models/Usuario";
import { IUsuario, UsuarioResponse } from '../../interfaces/Usuario/IUsuario';
import { Colaborador } from "../../models/Colaborador";
import { TrabajadorSocial } from "../../models/TrabajadorSocial";
import bcrypt from 'bcryptjs';
import { Perfil } from '../../models/Perfil';
import HPagination from '../../../helpers/HPagination';
import {
    IUsuarioPaginate,
    UsuarioResponsePaginate
} from '../../interfaces/Usuario/IUsuario';
import { USUARIO_ATTRIBUTES } from '../../../constants/UsuarioConstant';
import { PERFIL_INCLUDE } from '../../../includes/PerfilInclude';
import { COLABORADOR_INCLUDE } from '../../../includes/ColaboradorInclude';
import { TRABAJADOR_SOCIAL_INCLUDE } from '../../../includes/TrabSocialInclude';
import { PERSONA_INCLUDE } from '../../../includes/PersonaInclude';

class UsuarioRepository {
    /**
     * Obtiene todos los usuarios
     * @returns {Promise<UsuarioResponse>}
     */
    async getAll(): Promise<UsuarioResponse> {
        try {
            const usuarios = await Usuario.findAll({
                attributes: USUARIO_ATTRIBUTES,
                include: [
                    PERFIL_INCLUDE,
                    PERSONA_INCLUDE,
                    COLABORADOR_INCLUDE,
                    TRABAJADOR_SOCIAL_INCLUDE
                ],
                order: [
                    ['email', 'ASC']
                ]
            })

            return { result: true, data: usuarios, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<UsuarioResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Usuario.findAndCountAll({
                attributes: USUARIO_ATTRIBUTES,
                include: [
                    PERFIL_INCLUDE,
                    PERSONA_INCLUDE,
                    COLABORADOR_INCLUDE,
                    TRABAJADOR_SOCIAL_INCLUDE
                ],
                where: whereClause,
                order: [
                    ['email', 'ASC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IUsuarioPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: count,
                nextPage,
                previousPage
            }

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene un usuario por su ID
     * @param {string} id - El ID UUID del usuario a buscar
     * @returns {Promise<UsuarioResponse>} Respuesta con el usuario encontrado o mensaje de no encontrado
     */
    async getById(id: string): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id, {
                attributes: USUARIO_ATTRIBUTES,
                include: [
                    PERFIL_INCLUDE,
                    PERSONA_INCLUDE,
                    COLABORADOR_INCLUDE,
                    TRABAJADOR_SOCIAL_INCLUDE
                ],
                order: [
                    ['email', 'ASC']
                ]
            })

            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 404 }
            }

            return { result: true, data: usuario, message: 'Usuario encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea un usuario
     * @param {IUsuario} data - Los datos del usuario a crera
     * @returns {Promise<UsuarioResponse>} Respuesta con el usuario creado o error
     */
    async create(data: IUsuario): Promise<UsuarioResponse> {
        // Accede a la instancia de Sequelize a través de db.sequelize
        // const transaction = await sequelize.transaction()

        try {
            const { password } = data

            const salt = await bcrypt.genSalt(10)

            const hashedPassword = await bcrypt.hash(password as string, salt)

            data.password = hashedPassword

            const newUsuario = await Usuario.create(data)

            // await transaction.commit()

            const { id: idUsuario } = newUsuario

            if (idUsuario) {
                return {
                    result: true,
                    message: "Usuario registrado con éxito",
                    data: newUsuario,
                    status: 200
                }
            }

            return {
                result: false,
                message: "Error al registrar al usuario",
                data: [],
                status: 500
            }

        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return {
                result: false,
                error: errorMessage,
                status: 500
            }
        }
    }

    /**
     * Actualiza un usuario existente por su ID
     * @param {string} id - El ID del usuario a actualizar
     * @param {IUsuario} data - Los nuevos datos del usuario
     * @returns {Promise<UsuarioResponse>} Respuesta con el usuario actualizado o error
     */
    async update(id: string, data: IUsuario): Promise<UsuarioResponse> {
        // const transaction = await sequelize.transaction()

        try {
            // const usuario = await Usuario.findByPk(id, { transaction })
            const usuario = await Usuario.findByPk(id)

            if (!usuario) {
                // await transaction.rollback()
                return {
                    result: false,
                    data: [],
                    message: 'Usuario no encontrado',
                    status: 200
                }
            }

            const dataUpdateUsuario: Partial<IUsuario> = data

            // const updatedUsuario = await usuario.update(dataUpdateUsuario, { transaction })
            const updatedUsuario = await usuario.update(dataUpdateUsuario)

            // await transaction.commit()

            return {
                result: true,
                message: 'Usuario actualizado con éxito',
                data: updatedUsuario,
                status: 200
            }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return {
                result: false,
                error: errorMessage,
                status: 500
            }
        }
    }
}

export default new UsuarioRepository()