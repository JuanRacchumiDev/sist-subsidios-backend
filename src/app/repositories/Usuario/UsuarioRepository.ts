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
import { IUsuarioFilter } from '../../interfaces/Usuario/IUsuarioFilter';
import { Op, QueryTypes, WhereOptions } from 'sequelize';

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

    async getAllWithPaginate(
        page: number,
        limit: number,
        filters: IUsuarioFilter = {}
    ): Promise<UsuarioResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const {
                id_perfil,
                nombre_persona,
                username,
                email
            } = filters

            const conditions = ["1 = 1"];
            const replacements: any = { limit, offset };

            if (id_perfil) {
                conditions.push("us.id_perfil = :id_perfil")
                replacements.id_perfil = id_perfil
            }

            if (nombre_persona) {
                conditions.push("LOWER(us.nombre_persona) LIKE LOWER(:nombre_persona)")
                replacements.nombre_persona = `%${nombre_persona}%`
            }

            if (username) {
                conditions.push("LOWER(us.username) LIKE LOWER(:username)")
                replacements.username = `%${username}%`
            }

            if (email) {
                conditions.push("LOWER(us.email) LIKE LOWER(:email)")
                replacements.email = `%${email}%`
            }

            const whereClause = `WHERE ${conditions.join(" AND ")}`

            const baseQuery = `
                FROM usuario us
                INNER JOIN detalle_parametro dp
                ON dp.id = us.id_perfil
                ${whereClause}
            `

            const queryData = `
                SELECT
                    us.id, id_perfil, id_persona, username, email, nombre_persona, dp.nombre as nombre_perfil, us.estado
                ${baseQuery}
                ORDER BY us.username ASC
                LIMIT :limit OFFSET :offset;
            `

            const queryCount = `SELECT COUNT(us.id) as total ${baseQuery}`

            const rows = await sequelize.query(queryData, {
                replacements,
                type: 'SELECT',
                model: Usuario,
                mapToModel: true
            });

            console.log({ rows })

            const [countResult]: any = await sequelize.query(queryCount, {
                replacements,
                type: 'SELECT'
            });

            const total = parseInt(countResult.total);
            const totalPages = Math.ceil(total / limit)
            const nextPage = HPagination.getNextPage(page, limit, total)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IUsuarioPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: total,
                nextPage,
                previousPage
            }

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            };
        } catch (error: any) {
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

    /**
     * Actualiza el estado de un usuario
     * @param {string} id - El ID del usuario 
     * @param {boolean} estado - El nuevo estado del usuario 
     * @returns {Promise<UsuarioResponse>} Respuesta con el usuario actualizado
     */
    async updateEstado(id: string, estado: boolean): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id)

            if (!usuario) {
                return { result: false, message: 'Usuario no encontrado', status: 404 }
            }

            usuario.estado = estado
            await usuario.save()

            return { result: true, message: 'Estado actualizado con éxito', data: usuario, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default UsuarioRepository