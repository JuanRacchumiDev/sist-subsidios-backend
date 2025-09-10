import UsuarioRepository from '../../repositories/Usuario/UsuarioRepository';
import { IUsuario, UsuarioResponse } from '../../interfaces/Usuario/IUsuario';
import { newUserNotificationTemplate } from '../../utils/emailTemplate';
import transporter from '../../../config/mailer';
import { generateTemporaryPassword } from '../../utils/generatePassword';
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
        // Generar una contraseña temporal antes de hashearla
        const tempPassword = generateTemporaryPassword()

        data.password = tempPassword

        const response = await UsuarioRepository.create(data);

        const { result: resultUsuario, data: dataUsuario } = response

        if (resultUsuario && dataUsuario) {
            const { username, email } = dataUsuario as IUsuario

            const mailOptions = {
                from: process.env.EMAIL_USER_GMAIL,
                to: email,
                subject: '¡Bienvenido a la plataforma',
                html: newUserNotificationTemplate({
                    name: username as string,
                    email: email as string,
                    temporaryPassword: tempPassword,
                    appUrl: process.env.APP_URL || 'http://localhost:3002'
                })
            }

            try {
                await transporter.sendMail(mailOptions);
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