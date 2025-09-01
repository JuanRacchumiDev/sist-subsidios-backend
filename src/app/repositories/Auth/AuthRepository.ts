import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from "../../models/Usuario";
import dotenv from "dotenv"
import { Colaborador } from '../../models/Colaborador';
import { TrabajadorSocial } from '../../models/TrabajadorSocial';
import { Perfil } from '../../models/Perfil';
import { AuthCredenciales, AuthResponse } from '../../types/Auth/TAuth';

class AuthRepository {
    /**
     * Obtiene los datos de inicio de sesión
     * @param {AuthCredenciales} data - Los datos de inicio de sesión
     * @returns {Promise<AuthResponse>} Respuesta con los datos de inicio de sesión
     */
    async login(data: AuthCredenciales): Promise<AuthResponse> {
        dotenv.config()

        try {
            const { email, password } = data

            const getEmail = email as string
            const getPassword = password as string

            const existsUsuario = await Usuario.findOne(
                {
                    where: {
                        email: getEmail
                    },
                    include: [
                        {
                            model: Perfil,
                            as: 'perfil'
                        }
                    ]
                }
            )

            if (!existsUsuario) {
                return {
                    result: false,
                    message: 'Usuario no encontrado',
                    token: "",
                    status: 404
                }
            }

            const {
                id: idUsuario,
                password: passwordUsuario,
                id_colaborador,
                id_trabajadorsocial,
                username
            } = existsUsuario

            const comparePassword = await bcrypt.compare(getPassword, passwordUsuario as string)

            if (!comparePassword) {
                return {
                    result: false,
                    message: 'Credenciales inválidas',
                    token: "",
                    status: 401
                }
            }

            const JWT_SECRET = process.env.JWT_SECRET as string
            const EXPIRE_TOKEN = process.env.EXPIRE_TOKEN as string ?? '5h'

            if (!JWT_SECRET || !EXPIRE_TOKEN) {
                throw new Error("JWT_SECRET o EXPIRE_TOKEN no están definidos como variables de entorno")
            }

            const token = jwt.sign(
                { id: idUsuario, email: getEmail, username: username },
                JWT_SECRET,
                { expiresIn: '5h' }
            )

            if (!token) {
                return {
                    result: false,
                    message: 'Error de inicio de sesión',
                    token: "",
                    status: 500
                }
            }

            const { perfil } = existsUsuario

            let nombreCompletoUsuario: string = ""

            const existsColaborador = await Colaborador.findByPk(id_colaborador)

            const existsTrabSocial = await TrabajadorSocial.findByPk(id_trabajadorsocial)

            if (existsColaborador && !existsTrabSocial) {
                nombreCompletoUsuario = `${existsColaborador.nombres} ${existsColaborador.apellido_paterno} ${existsColaborador.apellido_materno}`
            } else if (!existsColaborador && existsTrabSocial) {
                nombreCompletoUsuario = `${existsTrabSocial.nombres} ${existsTrabSocial.apellido_paterno} ${existsTrabSocial.apellido_materno}`
            }

            return {
                result: true,
                message: 'Inicio de sesión exitoso',
                token,
                usuario: {
                    idUsuario,
                    username,
                    nombrePerfil: perfil?.nombre,
                    slugPerfil: perfil?.nombre_url,
                    nombreCompletoUsuario
                },
                status: 200,
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return {
                result: false,
                error: errorMessage,
                token: "",
                status: 500
            }
        }
    }

    /**
     * Obtiene los datos de usuario de cierre de sesión
     * @param {number} usuarioId - El ID del usuario de cierre de sesión 
     * @returns {Promise<AuthResponse>} Respuesta con el usuario de cierre de sesión
     */
    async logout(usuarioId: string): Promise<AuthResponse> {
        try {
            const usuario = await Usuario.findOne(
                {
                    where: {
                        id: usuarioId
                    }
                }
            )

            if (!usuario) {
                return {
                    result: false,
                    error: "Usuario no encontrado",
                    status: 404
                }
            }

            return {
                result: true,
                message: 'Sesión cerrada con éxito',
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default new AuthRepository()