import nodemailer from 'nodemailer';
import ConfiguracionRepository from '../app/repositories/Configuracion/ConfiguracionRepository'

/**
 * Crea y retorna un transportador de Nodemailer dinámico basado en la BD o variables de entorno.
 */
export async function createDynamicTransporter() {
    const configuracionRepository = new ConfiguracionRepository();

    const emailConfig = await configuracionRepository.getEmailConfiguration();
    console.log({ emailConfig })

    return {
        transporter: nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.port === 465, // true para puerto 465, false para otros (como 587 o Mailtrap)
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass
            }
        }),
        fromAddress: emailConfig.fromAddress,
        fromName: emailConfig.fromName
    };
}

// import dotenv from 'dotenv'
// import path from 'path'

// // Determina el entorno
// const { env } = process
// const { NODE_ENV } = env

// const getEnv = NODE_ENV || 'development'

// const envFilePath = path.resolve(process.cwd(), `.env.${getEnv}`)

// dotenv.config({ path: envFilePath })

// export const transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: Number(process.env.MAIL_PORT) || 2525,
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS
//     }
// })