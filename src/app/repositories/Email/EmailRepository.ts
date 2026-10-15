import { IEmailRepository, SendEmailOptions } from "./IEmailRepository"
import { createDynamicTransporter } from '../../../config/mailer'

export class EmailRepository implements IEmailRepository {
    async sendEmail(options: SendEmailOptions): Promise<boolean> {
        try {
            const { to, subject, html } = options;

            // Obtenemos el transportador y los remitentes configurados dinámicamente
            const { transporter, fromAddress, fromName } = await createDynamicTransporter();

            const mailOptions = {
                from: `"${fromName}" <${fromAddress}>`,
                to,
                subject,
                html
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`[EmailRepository] Correo enviado exitosamente a ${to}: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('[EmailRepository] Error enviando correo:', error);
            return false;
        }
    }
}