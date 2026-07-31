import { IEmailRepository, SendEmailOptions } from "./IEmailRepository"
import { transporter } from '../../../config/mailer'

export class EmailRepository implements IEmailRepository {
    async sendEmail(options: SendEmailOptions): Promise<boolean> {
        try {
            const { to, subject, html } = options
            const fromAddress = process.env.MAIL_FROM_ADDRESS || 'noreply@tuapp.com'
            const fromName = process.env.MAIL_FROM_NAME || 'Sistema'

            const mailOptions = {
                from: `"${fromName}" <${fromAddress}>`,
                to,
                subject,
                html
            }

            const info = await transporter.sendMail(mailOptions)
            console.log(`[EmailRepository] Correo enviado exitosamente: ${info.messageId}`)
            return true
        } catch (error) {
            console.error('[EmailRepository] Error enviando correo:', error);
            return false;
        }
    }
}