import UsuarioRepository from '../../repositories/Usuario/UsuarioRepository';
import PersonaRepository from '../../repositories/Persona/PersonaRepository'
import { IUsuario, UsuarioResponse } from '../../interfaces/Usuario/IUsuario';
import { newUserNotificationTemplate } from '../../utils/emailTemplate';
import transporter from '../../../config/mailer';
import { generateTemporaryPassword } from '../../utils/generatePassword';
import { IPersona } from '../../interfaces/Persona/IPersona';
/**
 * @class CreateUsuarioService
 * @description Servicio para crear un nuevo usuario.
 */
class CreateUsuarioService {
    protected usuarioRepository: UsuarioRepository
    protected personaRepository: PersonaRepository

    constructor() {
        this.usuarioRepository = new UsuarioRepository()
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para crear un usuario.
     * @param {IUsuario} data - Los datos del usuario a crear.
     * @returns {Promise<UsuarioResponse>} La respuesta de la operación.
     */
    async execute(data: IUsuario): Promise<UsuarioResponse> {
        let fullName: string = ""

        let numeroDocumento: string = ""

        const { id_persona, username, email } = data

        const userNameStr = username as string

        const emailStr = email as string

        try {

            // Obteniendo la persona registrada
            if (id_persona) {
                const responsePersona = await this.personaRepository.getById(id_persona)

                const { data: dataPersona } = responsePersona

                const detailPersona = dataPersona as IPersona

                const { numero_documento, nombres, apellido_paterno, apellido_materno } = detailPersona
                fullName = `${nombres} ${apellido_paterno} ${apellido_materno}`

                numeroDocumento = numero_documento as string

                data.nombre_persona = fullName
            } else {
                fullName = userNameStr
            }

            // Generar una contraseña temporal antes de hashearla
            const tempPassword: string = generateTemporaryPassword()

            // data.password = tempPassword

            data.password = (numeroDocumento) ? numeroDocumento : tempPassword

            console.log('---- data new usuario ----')
            console.log({ data })

            const response = await this.usuarioRepository.create(data);

            console.log('---- response createUsuario ----')
            console.log({ response })

            const { result: resultUsuario, data: dataUsuario } = response

            if (resultUsuario && dataUsuario) {

                console.log('existe resultUsuario y existe dataUsuario')

                const dataEmail = {
                    name: fullName,
                    email: emailStr,
                    temporaryPassword: data.password,
                    appUrl: process.env.APP_URL || 'http://localhost:3000',
                }

                console.log({ dataEmail })

                const mailOptions = {
                    from: process.env.EMAIL_USER_GMAIL,
                    to: email,
                    subject: '¡Bienvenido a la plataforma',
                    html: newUserNotificationTemplate(dataEmail)
                }

                console.log({ mailOptions })

                const responseEmail = await transporter.sendMail(mailOptions);
                console.log({ responseEmail })
                console.log(`Correo de bienvenida enviado a ${username}`);

                return response
            } else {
                console.log('no existe resultUsuario, no existe dataUsuario')
            }

            return {
                result: false,
                status: 422,
                message: "No se pudo crear el nuevo usuario",
                data: []
            }

        } catch (error) {
            console.log(typeof error)
            console.error(`Error al enviar el correo a ${email}:`, error);

            return {
                result: false,
                status: 422,
                message: "Error al crear el nuevo usuario",
                data: [],
            }
        }
    }
}

export default new CreateUsuarioService();