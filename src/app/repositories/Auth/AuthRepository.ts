import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from "../../models/Usuario";
import dotenv from "dotenv"
import { Colaborador } from '../../models/Colaborador';
import { TrabajadorSocial } from '../../models/TrabajadorSocial';
import { Perfil } from '../../models/Perfil';
import { AuthCredenciales, AuthResponse } from '../../types/Auth/TAuth';
import HString from '../../../helpers/HString';
import { Persona } from '../../models/Persona';
import { IUsuario } from '../../interfaces/Usuario/IUsuario';
import { IColaborador } from '../../interfaces/Colaborador/IColaborador';
import ColaboradorRepository from '../Colaborador/ColaboradorRepository'

class AuthRepository {
    private colaboradorRepository: ColaboradorRepository

    constructor() {
        this.colaboradorRepository = new ColaboradorRepository()
    }
    /**
     * Obtiene los datos de inicio de sesión
     * @param {AuthCredenciales} data - Los datos de inicio de sesión
     * @returns {Promise<AuthResponse>} Respuesta con los datos de inicio de sesión
     */
    async login(data: AuthCredenciales): Promise<AuthResponse> {
        dotenv.config()

        let nombreCompleto: string = ""

        let idEmpresa: string = ""

        let idColaborador: string = ""

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
                        },
                        {
                            model: Persona,
                            as: 'persona'
                        }
                    ]
                }
            )

            if (!existsUsuario) {
                return {
                    result: false,
                    message: 'Email no encontrado',
                    token: "",
                    status: 404
                }
            }

            const {
                id: idUsuario,
                username,
                password: passwordUsuario,
                perfil,
                persona
            } = existsUsuario as IUsuario

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

            if (persona) {
                const {
                    nombres,
                    apellido_paterno,
                    apellido_materno,
                    id_tipodocumento,
                    numero_documento
                } = persona

                nombreCompleto = `${nombres} ${apellido_paterno} ${apellido_materno}`;

                /// Validando si existe colaborador
                const responseColaborador = await this.colaboradorRepository.getByIdTipoDocAndNumDoc(
                    id_tipodocumento as string,
                    numero_documento as string
                )

                const { result, data } = responseColaborador

                if (result && data) {
                    const { id, id_empresa } = data as IColaborador

                    idColaborador = id as string
                    idEmpresa = id_empresa as string
                }
            }

            const codigo_temp: string = HString.generateRandomString(10)

            return {
                result: true,
                message: 'Inicio de sesión exitoso',
                token,
                usuario: {
                    id_usuario: idUsuario,
                    id_empresa: idEmpresa,
                    id_colaborador: idColaborador,
                    username,
                    nombre_perfil: perfil?.nombre,
                    slug_perfil: perfil?.nombre_url,
                    nombre_completo: nombreCompleto
                },
                status: 200,
                codigo_temp
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return {
                result: false,
                error: errorMessage,
                token: "",
                status: 500,
                codigo_temp: ""
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

// export default new AuthRepository()

export default AuthRepository