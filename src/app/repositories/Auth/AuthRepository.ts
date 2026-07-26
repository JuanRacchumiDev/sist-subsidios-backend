import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from "../../models/Usuario";
import dotenv from "dotenv"
import { AuthCredenciales, AuthResponse } from '../../types/Auth/TAuth';
import HString from '../../../helpers/HString';
import { DetalleParametro } from '../../models/DetalleParametro'
import { Persona } from '../../models/Persona';
import { IUsuario } from '../../interfaces/Usuario/IUsuario';
import { IPersona } from '../../interfaces/Persona/IPersona'
import PersonaRepository from '../Persona/PersonaRepository'
import { TCodigoTemp } from '../../types/DescansoMedico/TCodigoTemp';

class AuthRepository {
    private personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
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

        let idPersona: string = ""

        let emailPersonal: string = ""

        let emailInstitucional: string = ""

        try {
            console.log({ data })

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
                            model: DetalleParametro,
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
                    id,
                    id_empresa,
                    email_institucional,
                    email_personal,
                    nombre_completo,
                    numero_documento
                } = persona as Persona

                idPersona = id as string
                idEmpresa = id_empresa as string
                emailInstitucional = email_institucional as string
                emailPersonal = email_personal as string
                nombreCompleto = nombre_completo as string
            }

            const { nombre_url, nombre: nombrePerfil } = perfil as DetalleParametro

            const dataUsuario = {
                id_usuario: idUsuario,
                id_empresa: idEmpresa,
                id_persona: idPersona,
                username,
                nombre_perfil: nombrePerfil,
                nombre_perfil_url: nombre_url,
                nombre_completo: nombreCompleto,
                email_institucional: emailInstitucional,
                email_personal: emailPersonal
            }

            console.log({ dataUsuario })

            return {
                result: true,
                message: 'Inicio de sesión exitoso',
                token,
                usuario: dataUsuario,
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return {
                result: false,
                error: errorMessage,
                token: "",
                status: 500,
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

            console.log({ usuario })

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

    async createCodigoTemp(): Promise<TCodigoTemp> {
        try {
            const codigo_temp: string = HString.generateRandomString(10)
            return {
                result: true,
                codigo_temp,
                error: "",
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return {
                result: false,
                codigo_temp: "",
                error: errorMessage,
                status: 500
            }
        }
    }
}

// export default new AuthRepository()

export default AuthRepository