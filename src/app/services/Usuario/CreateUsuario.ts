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
    /**
     * Ejecuta la operación para crear un usuario.
     * @param {IUsuario} data - Los datos del usuario a crear.
     * @returns {Promise<UsuarioResponse>} La respuesta de la operación.
     */
    async execute(data: IUsuario): Promise<UsuarioResponse> {
        let fullName: string = ""

        // Generar una contraseña temporal antes de hashearla
        const tempPassword: string = generateTemporaryPassword()

        data.password = tempPassword

        const response = await UsuarioRepository.create(data);

        const { result: resultUsuario, data: dataUsuario } = response

        if (resultUsuario && dataUsuario) {

            const usuario = dataUsuario as IUsuario

            const { username, email, id_persona } = usuario

            // Obteniendo la persona registrada
            if (id_persona) {
                const responsePersona = await PersonaRepository.getById(id_persona)

                const { data } = responsePersona

                const dataPersona = data as IPersona

                const { nombres, apellido_paterno, apellido_materno } = dataPersona
                fullName = `${nombres} ${apellido_paterno} ${apellido_materno}`
            } else {
                fullName = username as string
            }

            const dataEmail = {
                name: fullName,
                email: email as string,
                temporaryPassword: tempPassword,
                appUrl: process.env.APP_URL || 'http://localhost:3000',
            }

            const mailOptions = {
                from: process.env.EMAIL_USER_GMAIL,
                to: email,
                subject: '¡Bienvenido a la plataforma',
                html: newUserNotificationTemplate(dataEmail)
            }

            try {
                const responseEmail = await transporter.sendMail(mailOptions);
                console.log(`Correo de bienvenida enviado a ${username}`);
            } catch (emailError) {
                console.error(`Error al enviar el correo a ${email}:`, emailError);
                // Opcional: Podrías manejar el error aquí sin afectar la respuesta de la API.
            }
        }

        return response
    }
}

export default new CreateUsuarioService();