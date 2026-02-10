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
        filters: IUsuarioFilter
    ): Promise<UsuarioResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            // Definiendo los campos de la query de datos
            const selectData = `dp.nombre as nombre_perfil, p.id as id_persona, p.nombres, p.apellido_paterno, p.apellido_materno, p.nombre_completo,
                u.id, u.id_perfil, u.id_persona, u.username, u.email, u.estado `;

            // Definiendo el total de usuarios de la consulta
            const selectCount = `COUNT (u.id) as total `;

            // Definiendo el detalle de la consulta
            let detailData = `FROM usuario u inner join detalle_parametro dp on dp.id = u.id_perfil
                LEFT JOIN persona p on p.id = u.id_persona `;

            // Construcción dinámica de WHERE y preparación de replacements
            const replacements: any = {
                limit,
                offset,
                nombre_persona: filters.nombre_persona ? `%${filters.nombre_persona}%` : null,
                id_perfil: filters.id_perfil
            }

            let conditions: string[] = []

            if (filters.id_perfil !== undefined) {
                conditions.push(`u.id_perfil = :id_perfil`)
            }

            if (filters.nombre_persona !== undefined) {
                conditions.push(`p.nombre_completo LIKE :nombre_persona`)
            }

            if (conditions.length > 0) {
                detailData += `WHERE ` + conditions.join(' AND ')
            }

            const queryData = `SELECT ${selectData} ${detailData} ORDER BY u.email ASC LIMIT :limit OFFSET :offset;`;

            console.log({ queryData })

            // if (filters.id_perfil !== undefined && filters.nombre_persona === undefined) {
            //     detailData += `WHERE u.id_perfil = :filters.id_perfil `
            // }

            // if (filters.id_perfil === undefined && filters.nombre_persona !== undefined) {
            //     detailData += `WHERE p.nombre_completo LIKE :filters.nombre_persona `
            // }

            // if (filters.id_perfil !== undefined && filters.nombre_persona !== undefined) {
            //     detailData += `WHERE u.id_perfil = :filters.id_perfil AND p.nombre_completo LIKE :filters.nombre_persona `
            // }

            // // Definiendo la consulta de datos
            // let queryData = `SELECT  `;

            // queryData += selectData;

            // queryData += detailData;

            // queryData += `ORDER BY u.email ASC`;

            // queryData += `LIMIT :limit OFFSET :offset;`

            // console.log({ queryData })

            // // Definiendo la consulta de total de resultados
            // let queryCount = `SELECT `;

            // queryCount += selectCount;

            // queryCount += detailData;

            const rows = await sequelize.query(queryData, {
                replacements: replacements,
                type: QueryTypes.SELECT,
                model: Usuario,
                mapToModel: true
            })

            const queryCount = `SELECT ${selectCount} ${detailData}`

            console.log({ queryCount })

            // const [{ total }] = await sequelize.query(queryCount, {
            //     replacements: { filters.id_perfil, filters.nombre_persona, limit, offset },
            //     type: 'SELECT'
            // }) as any

            const [countResult]: any = await sequelize.query(queryCount, {
                replacements: replacements,
                type: QueryTypes.SELECT
            })

            const total = parseInt(countResult.total)

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

            console.log({ pagination })

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    // async getAllWithPaginate(
    //     page: number,
    //     limit: number,
    //     filters: IUsuarioFilter
    // ): Promise<UsuarioResponsePaginate> {
    //     try {
    //         // Obtenemos los parámetros de consulta
    //         const offset = HPagination.getOffset(page, limit)

    //         // Construcción dinámica de la claúsula WHERE
    //         const where: WhereOptions = {}

    //         if (filters.id_perfil !== undefined) {
    //             where.id_perfil = filters.id_perfil
    //         }

    //         if (filters.nombre_persona !== undefined) {
    //             where.nombre_persona = {
    //                 [Op.like]: `%${filters.nombre_persona}%`
    //             }
    //         }

    //         const { count, rows } = await Usuario.findAndCountAll({
    //             attributes: USUARIO_ATTRIBUTES,
    //             include: [
    //                 PERFIL_INCLUDE,
    //                 PERSONA_INCLUDE,
    //                 COLABORADOR_INCLUDE,
    //                 TRABAJADOR_SOCIAL_INCLUDE
    //             ],
    //             where,
    //             order: [
    //                 ['email', 'ASC']
    //             ],
    //             limit,
    //             offset
    //         })

    //         const totalPages = Math.ceil(count / limit)
    //         const nextPage = HPagination.getNextPage(page, limit, count)
    //         const previousPage = HPagination.getPreviousPage(page)

    //         const pagination: IUsuarioPaginate = {
    //             currentPage: page,
    //             limit,
    //             totalPages,
    //             totalItems: count,
    //             nextPage,
    //             previousPage
    //         }

    //         return {
    //             result: true,
    //             data: rows,
    //             pagination,
    //             status: 200
    //         }

    //     } catch (error) {
    //         const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    //         return { result: false, error: errorMessage, status: 500 }
    //     }
    // }

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