import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import path from 'path'

// Determina el entorno
const { env } = process
const { NODE_ENV } = env

const getEnv = NODE_ENV || 'development'

const envFilePath = path.resolve(process.cwd(), `.env.${getEnv}`)

dotenv.config({ path: envFilePath })

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 2525,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
    // service: 'gmail',
    // auth: {
    //     user: process.env.EMAIL_USER_GMAIL,
    //     pass: process.env.EMAIL_PASS_GMAIL
    // }
})

// export default transporter