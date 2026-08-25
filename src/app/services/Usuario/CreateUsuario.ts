import UsuarioRepository from '../../repositories/Usuario/UsuarioRepository';
import PersonaRepository from '../../repositories/Persona/PersonaRepository'
import DetalleParametroRepository from '../../repositories/DetalleParametro/DetalleParametroRepository'
import { IUsuario, UsuarioResponse } from '../../interfaces/Usuario/IUsuario';
import { newUserNotificationTemplate } from '../../utils/emailTemplate';
import { generateTemporaryPassword } from '../../utils/generatePassword';
import { EmailRepository } from '../../repositories/Email/EmailRepository'
import { IPersona, PersonaResponse } from '../../interfaces/Persona/IPersona';
import { IDetalleParametro, DetalleParametroResponse } from '../../interfaces/DetalleParametro/IDetalleParametro'
/**
 * @class CreateUsuarioService
 * @description Servicio para crear un nuevo usuario.
 */
class CreateUsuarioService {
    protected usuarioRepository: UsuarioRepository
    protected personaRepository: PersonaRepository
    protected emailRepository: EmailRepository
    protected detalleParametroRepository: DetalleParametroRepository

    constructor() {
        this.usuarioRepository = new UsuarioRepository()
        this.personaRepository = new PersonaRepository()
        this.emailRepository = new EmailRepository()
        this.detalleParametroRepository = new DetalleParametroRepository()
    }

    /**
     * Ejecuta la operación para crear un usuario.
     * @param {IUsuario} data - Los datos del usuario a crear.
     * @returns {Promise<UsuarioResponse>} La respuesta de la operación.
     */
    async execute(data: IUsuario): Promise<UsuarioResponse> {
        let persona: IPersona = {}
        let perfil: IDetalleParametro = {}

        let { id_persona, id_perfil, username, email } = data

        try {
            if (id_persona && id_perfil) {

                // Obteniendo la persona seleccionada
                const responsePersona = await this.personaRepository.getById(id_persona) as PersonaResponse

                const { result: resultPersona, data: dataPersona } = responsePersona

                if (resultPersona && dataPersona) {
                    persona = dataPersona as IPersona

                    const { nombre_completo } = persona

                    data.nombre_persona = nombre_completo
                }

                // Obteniendo el perfil seleccionado
                const responsePerfil = await this.detalleParametroRepository.getById(id_perfil) as DetalleParametroResponse

                const { result: resultPerfil, data: dataPerfil } = responsePerfil

                if (resultPerfil && dataPerfil) {
                    perfil = dataPerfil as IDetalleParametro
                }

                // Definiendo contraseña de acceso
                const tempPassword: string = generateTemporaryPassword()

                const isValidDocumento = persona && persona.numero_documento

                const passwordBase = (isValidDocumento) ? persona?.numero_documento : tempPassword

                data.password = passwordBase

                // Obteniendo el resultado del registro de un usuario
                const responseUsuario = await this.usuarioRepository.create(data)

                console.log({ responseUsuario })

                const { result: resultUsuario, data: dataUsuario } = responseUsuario

                if (resultUsuario && dataUsuario) {
                    const usuario = dataUsuario as IUsuario

                    const dataEmail = {
                        persona,
                        perfil,
                        username: usuario.username,
                        email: usuario.email,
                        password: passwordBase,
                        appUrl: process.env.APP_URL || "http://localhost:3000"
                    }

                    console.log({ dataEmail })

                    const htmlContent = newUserNotificationTemplate(dataEmail)

                    await this.emailRepository.sendEmail({
                        to: usuario.email as string,
                        subject: '¡Bienvenido a la plataforma!',
                        html: htmlContent
                    });

                    delete data.password

                    console.log(`Correo de bienvenida enviado a ${username}`);

                    return responseUsuario
                }

                return responseUsuario
            }

            return {
                result: false,
                status: 422,
                message: "La selección de la persona o perfil no son correctos",
                data: [],
            }

        } catch (error) {
            console.log(typeof error)
            console.error(`Error al enviar el correo a ${email}:`, error);

            return {
                result: false,
                status: 422,
                message: "Error al crear el nuevo usuario",
                data: [],
                error
            }
        }
    }
}

export default new CreateUsuarioService();